const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

test('the npm tarball loads through native CommonJS and ESM package exports', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'redux-io-package-'));
  try {
    const packed = JSON.parse(
      execFileSync(
        'npm',
        [
          'pack',
          '--json',
          '--ignore-scripts',
          '--pack-destination',
          directory,
          '--cache',
          path.join(directory, 'cache'),
        ],
        { encoding: 'utf8' },
      ),
    )[0];
    assert.ok(packed.files.some(file => file.path === 'dist/redux.io.mjs'));
    for (const file of [
      'dist/redux.io.d.ts',
      'dist/redux.io.d.mts',
      'lib/index.ts',
      'lib/types.ts',
      'dist/react.js',
      'dist/react.mjs',
      'dist/react.d.ts',
      'dist/react.d.mts',
      'lib/react.ts',
      'lib/useSocket.ts',
    ]) {
      assert.ok(
        packed.files.some(entry => entry.path === file),
        `Missing ${file}`,
      );
    }
    assert.ok(
      packed.files.every(file =>
        /^(dist\/|lib\/.*\.ts$|README.md$|CHANGELOG.md$|LICENSE$|package.json$)/.test(
          file.path,
        ),
      ),
    );
    execFileSync('tar', [
      '-xzf',
      path.join(directory, packed.filename),
      '-C',
      directory,
    ]);
    const publication = JSON.parse(
      execFileSync(
        'npm',
        [
          'publish',
          './package',
          '--dry-run',
          '--ignore-scripts',
          '--offline',
          '--json',
          '--access',
          'public',
          '--registry',
          'https://registry.npmjs.org',
          '--cache',
          path.join(directory, 'cache'),
        ],
        { cwd: directory, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
      ),
    );
    const publishedPackage = publication['redux.io'] ?? publication;
    assert.equal(publishedPackage.name, 'redux.io');
    assert.equal(
      publishedPackage.version,
      JSON.parse(readFileSync(path.join(__dirname, '../package.json'), 'utf8'))
        .version,
    );
    assert.ok(
      publishedPackage.files.some(file => file.path === 'CHANGELOG.md'),
    );
    assert.ok(
      publishedPackage.files.some(file => file.path === 'dist/redux.io.mjs'),
    );
    const modules = path.join(directory, 'node_modules');
    mkdirSync(modules);
    symlinkSync(
      path.join(directory, 'package'),
      path.join(modules, 'redux.io'),
    );
    for (const dependency of [
      'react',
      'react-redux',
      'redux',
      'socket.io-client',
    ]) {
      symlinkSync(
        path.dirname(require.resolve(dependency + '/package.json')),
        path.join(modules, dependency),
      );
    }
    const check =
      "if (typeof pkg.reducer !== 'function' || typeof pkg.withSocket !== 'function') throw new Error('Missing exports');";
    execFileSync(
      process.execPath,
      ['-e', "const pkg = require('redux.io');" + check],
      { cwd: directory },
    );
    execFileSync(
      process.execPath,
      ['--input-type=module', '-e', "import * as pkg from 'redux.io';" + check],
      { cwd: directory },
    );
    mkdirSync(path.join(modules, '@types'));
    mkdirSync(path.join(modules, '@reduxjs'));
    for (const dependency of [
      '@types/react',
      '@types/hoist-non-react-statics',
      '@reduxjs/toolkit',
      'hoist-non-react-statics',
    ]) {
      symlinkSync(
        path.join(__dirname, '../node_modules', dependency),
        path.join(modules, dependency),
      );
    }
    const compiler = require.resolve('typescript/bin/tsc');
    for (const type of ['module', 'commonjs']) {
      writeFileSync(
        path.join(directory, 'package.json'),
        JSON.stringify({ type }),
      );
      writeFileSync(
        path.join(directory, 'consumer.tsx'),
        readFileSync(path.join(__dirname, 'types/consumer.tsx')),
      );
      writeFileSync(
        path.join(directory, 'source.ts'),
        "import { withSocket, type SocketInterface } from 'redux.io/source'; export const connect = withSocket; export type Client = SocketInterface;",
      );
      writeFileSync(
        path.join(directory, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            strict: true,
            noEmit: true,
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            jsx: 'react-jsx',
            target: 'ES2022',
            types: ['react'],
          },
          files: ['consumer.tsx', 'source.ts'],
        }),
      );
      execFileSync(process.execPath, [compiler, '-p', directory], {
        cwd: directory,
        stdio: 'pipe',
      });
      writeFileSync(
        path.join(directory, 'consumer.tsx'),
        readFileSync(path.join(__dirname, 'types/invalid.tsx')),
      );
      let diagnostics = '';
      try {
        execFileSync(
          process.execPath,
          [compiler, '-p', directory, '--pretty', 'false'],
          { cwd: directory, stdio: 'pipe' },
        );
      } catch (error) {
        diagnostics = error.stdout.toString();
      }
      const errors = diagnostics
        .split('\n')
        .filter(line => line.includes('error TS'));
      assert.equal(
        errors.length,
        7,
        `Expected seven rejected type errors (${type}):\n${diagnostics}`,
      );
      assert.ok(
        errors.every(line => /(?:^|\/)consumer\.tsx\(/.test(line)),
        diagnostics,
      );
    }
    for (const dependency of [
      'redux',
      'react-redux',
      '@reduxjs',
      '@types/hoist-non-react-statics',
      'hoist-non-react-statics',
    ]) {
      rmSync(path.join(modules, dependency), { recursive: true, force: true });
    }
    const manifest = JSON.parse(
      readFileSync(path.join(directory, 'package/package.json'), 'utf8'),
    );
    assert.equal(manifest.peerDependenciesMeta.redux.optional, true);
    assert.equal(manifest.peerDependenciesMeta['react-redux'].optional, true);
    for (const file of ['react.js', 'react.mjs', 'react.d.ts', 'react.d.mts']) {
      assert.doesNotMatch(
        readFileSync(path.join(directory, 'package/dist', file), 'utf8'),
        /redux|hoist-non-react-statics/,
      );
    }
    execFileSync(
      process.execPath,
      [
        '-e',
        "const assert = require('node:assert/strict'); for (const dependency of ['redux', 'react-redux']) assert.throws(() => require.resolve(dependency), { code: 'MODULE_NOT_FOUND' }); assert.equal(typeof require('redux.io/react').useSocket, 'function');",
      ],
      { cwd: directory },
    );
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        "import { useSocket } from 'redux.io/react'; if (typeof useSocket !== 'function') throw new Error('Missing hook');",
      ],
      { cwd: directory },
    );
    for (const type of ['module', 'commonjs']) {
      writeFileSync(
        path.join(directory, 'package.json'),
        JSON.stringify({ type }),
      );
      writeFileSync(
        path.join(directory, 'consumer.tsx'),
        readFileSync(path.join(__dirname, 'types/react-consumer.tsx')),
      );
      writeFileSync(
        path.join(directory, 'source.ts'),
        "export { useSocket } from 'redux.io/react/source'; export type { UseSocketResult } from 'redux.io/react/source';",
      );
      execFileSync(process.execPath, [compiler, '-p', directory], {
        cwd: directory,
        stdio: 'pipe',
      });
      writeFileSync(
        path.join(directory, 'consumer.tsx'),
        readFileSync(path.join(__dirname, 'types/react-invalid.tsx')),
      );
      let diagnostics = '';
      try {
        execFileSync(
          process.execPath,
          [compiler, '-p', directory, '--pretty', 'false'],
          { cwd: directory, stdio: 'pipe' },
        );
      } catch (error) {
        diagnostics = error.stdout.toString();
      }
      const errors = diagnostics
        .split('\n')
        .filter(line => line.includes('error TS'));
      assert.equal(
        errors.length,
        6,
        `Expected six React hook type errors (${type}):\n${diagnostics}`,
      );
      assert.ok(
        errors.every(line => /(?:^|\/)consumer\.tsx\(/.test(line)),
        diagnostics,
      );
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('the UMD build exposes the browser API', () => {
  const context = {
    React: require('react'),
    ReactRedux: require('react-redux'),
  };
  vm.runInNewContext(
    readFileSync(path.join(__dirname, '../dist/redux.io.umd.js'), 'utf8'),
    context,
  );
  assert.equal(typeof context.redux.io.withSocket, 'function');
  assert.equal(typeof context.redux.io.reducer, 'function');
});
