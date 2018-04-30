import cjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';

import pkg from './package.json';

const extensions = ['.js', '.jsx'];

const external = Object.keys(pkg.peerDependencies);

const plugins = {
  cjs: cjs({
    include: 'node_modules/**',
  }),
  resolve: resolve({
    jsnext: true,
    main: true,
    browser: true,
    extensions,
  }),
  buble: {
    cjs: buble({
      jsx: 'React.createElement',
      objectAssign: 'Object.assign',
    }),
    es: buble({
      transforms: {
        modules: false,
        letConst: false,
        arrow: false,
        classes: false,
        destructuring: false,
        parameterDestructuring: false,
        defaultParameter: false,
        templateString: false,
      },
      jsx: 'React.createElement',
      objectAssign: 'Object.assign',
    }),
  },
};

const input = 'lib/index.js';

export default [
  {
    input,
    output: [{ file: pkg.module, format: 'es' }],
    external,
    plugins: [plugins.resolve, plugins.cjs, plugins.buble.es],
  },
  {
    input,
    output: [
      { file: pkg.browser, format: 'umd', exports: 'auto', name: 'redux.io' },
      { file: pkg.main, format: 'cjs' },
    ],
    external,
    plugins: [plugins.resolve, plugins.cjs, plugins.buble.cjs],
  },
];
