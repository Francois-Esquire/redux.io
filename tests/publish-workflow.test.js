import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { parse } from 'yaml';
import { expect, it } from 'vitest';

const source = readFileSync('.github/workflows/publish.yml', 'utf8');
const workflow = parse(source);
const { build, publish } = workflow.jobs;

it('publishes only after the build succeeds and uses its artifact', () => {
  expect(publish.needs).toEqual(['build']);
  expect(publish.if).toBe("${{ needs.build.result == 'success' }}");
  const upload = build.steps.find(step =>
    step.uses?.startsWith('actions/upload-artifact@'),
  );
  const download = publish.steps.find(step =>
    step.uses?.startsWith('actions/download-artifact@'),
  );
  expect(download.with.name).toBe(upload.with.name);
  expect(build.steps.find(step => step.name === 'Test and build').run).toBe(
    'npm run check',
  );
  expect(upload.with.path).toContain('artifact/package.tgz');
  expect(
    publish.steps.find(step => step.name === 'Unpack the built package').run,
  ).toBe('tar -xzf artifact/package.tgz');
});

it('restricts the npm environment to the publish job', () => {
  expect(publish.environment).toBe('npm');
  expect(build.environment).toBeUndefined();
});

it('uses tokenless OIDC only in the isolated publish job with caching disabled', () => {
  expect(workflow.permissions).toEqual({ contents: 'read' });
  expect(build.permissions?.['id-token']).toBeUndefined();
  expect(publish.permissions['id-token']).toBe('write');
  expect(publish['runs-on']).toBe('ubuntu-latest');
  expect(source).not.toMatch(/NPM_TOKEN|NODE_AUTH_TOKEN|secrets\./);
  for (const job of [build, publish]) {
    const setup = job.steps.find(step => step.uses === 'actions/setup-node@v6');
    expect(setup.with['node-version']).toBe('24');
    expect(setup.with['package-manager-cache']).toBe(false);
    expect(setup.with.cache).toBeUndefined();
  }
  expect(build.steps[0].uses).toBe('actions/checkout@v6');
  expect(build.steps[0].with['persist-credentials']).toBe(false);
  expect(
    publish.steps.some(step => step.uses?.startsWith('actions/checkout@')),
  ).toBe(false);
  const commands = publish.steps.map(step => step.run ?? '').join('\n');
  expect(commands).not.toMatch(/npm (?:ci|install|exec|run)|\bnpx\b/);
  expect(commands).toContain(
    'npm publish ./package --ignore-scripts --access public',
  );
  const release = publish.steps.find(
    step => step.name === 'Create or update GitHub release notes',
  );
  expect(release.if).toBe("steps.npm.outputs.published == 'true'");
});

it('uses tag pushes rather than a second release-created publish trigger', () => {
  expect(workflow.on.push.tags).toEqual(['v*']);
  expect(workflow.on).toHaveProperty('workflow_dispatch');
  expect(workflow.on.release).toBeUndefined();
  expect(workflow.concurrency['cancel-in-progress']).toBe(false);
});

it.each([
  ['1.0.0', 'tag', 'v1.0.0', true, false],
  ['1.0.0-rc.1', 'tag', 'v1.0.0-rc.1', true, true],
  ['1.0.0', 'tag', 'v0.2.1', false, false],
  ['1.0.0', 'branch', 'main', false, false],
])(
  'validates version %s at %s %s before installation',
  (version, refType, tag, valid, prerelease) => {
    const directory = mkdtempSync(join(tmpdir(), 'redux-io-workflow-'));
    try {
      writeFileSync(
        join(directory, 'package.json'),
        JSON.stringify({ version }),
      );
      const output = join(directory, 'output');
      const step = build.steps.find(step => step.id === 'release');
      expect(build.steps.indexOf(step)).toBeLessThan(
        build.steps.findIndex(step => step.run === 'npm ci'),
      );
      const result = spawnSync('bash', ['-e', '-c', step.run], {
        cwd: directory,
        env: {
          ...process.env,
          REF_TYPE: refType,
          RELEASE_TAG: tag,
          GITHUB_OUTPUT: output,
        },
        encoding: 'utf8',
      });
      expect(result.status === 0).toBe(valid);
      if (valid)
        expect(readFileSync(output, 'utf8')).toBe(
          `tag=${tag}\nprerelease=${prerelease}\n`,
        );
      else expect(result.stderr).toContain('tag matching the package version');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  },
);

it.each([
  ['10.9.3', false],
  ['11.5.0', false],
  ['11.5.1', true],
  ['11.17.0', true],
  ['12.0.0', true],
])(
  'checks npm %s without installing tools in the publish job',
  (version, supported) => {
    const directory = mkdtempSync(join(tmpdir(), 'redux-io-npm-check-'));
    try {
      writeFileSync(
        join(directory, 'npm'),
        `#!/bin/sh\nprintf '%s\\n' '${version}'\n`,
        { mode: 0o755 },
      );
      const step = publish.steps.find(
        step => step.name === 'Verify npm supports trusted publishing',
      );
      const result = spawnSync('bash', ['-e', '-c', step.run], {
        env: { ...process.env, PATH: `${directory}:${process.env.PATH}` },
        encoding: 'utf8',
      });
      expect(result.status === 0).toBe(supported);
      if (!supported)
        expect(result.stderr).toContain(
          'Trusted publishing requires npm >=11.5.1',
        );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  },
);
