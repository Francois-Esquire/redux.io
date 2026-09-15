const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
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
    assert.ok(
      packed.files.every(file =>
        /^(dist\/|README.md$|CHANGELOG.md$|LICENSE$|package.json$)/.test(
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
    for (const dependency of ['react', 'react-redux']) {
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
