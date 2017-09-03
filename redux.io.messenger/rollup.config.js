import babel from 'rollup-plugin-babel';
import cjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

import pkg from '../package.json';

const debug = process.env.NODE_ENV !== 'production';

export default {
  input: 'redux.io.messenger/client/index.js',
  output: [{
    file: 'redux.io.messenger/public/client.js',
    format: 'iife',
  }],
  // external: Object.keys(pkg.devDependencies),
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      modulesOnly: true,
    }),
    cjs({
      namedExports: {
        react: [
          'Component',
          'Children',
          'createElement',
          'ReactCurrentOwner',
          'getNextDebugID',
          'ReactComponentTreeHook'],
      },
    }),
    babel({
      externalHelpers: true,
      exclude: 'node_modules/**',
      presets: ['react', ['env', {
        debug: false,
        spec: true,
        modules: false,
        useBuiltIns: false,
      }]],
      plugins: [
        'external-helpers',
        'minify-simplify',
        'minify-dead-code-elimination',
        'transform-simplify-comparison-operators',
        'transform-undefined-to-void',
        'transform-minify-booleans',
        'check-es2015-constants',
        'transform-es2015-classes',
        'transform-es2015-duplicate-keys',
        'transform-es2015-for-of',
        'transform-es2015-function-name',
        'transform-es2015-literals',
        'transform-es2015-object-super',
        'transform-es2015-spread',
        'transform-es2015-sticky-regex',
        'transform-es2015-unicode-regex',
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-do-expressions',
        ['minify-replace', {
          replacements: [{
            identifierName: 'debug',
            replacement: {
              type: 'booleanLiteral',
              value: debug,
            },
          }],
        }]],
    })],
};
