import buble from 'rollup-plugin-buble';

import pkg from './package.json';

const debug = process.env.NODE_ENV !== 'production';

export default {
  input: 'lib/index.js',
  output: [
    { file: pkg.browser, format: 'umd', exports: 'auto', name: 'redux.io' },
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }],
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    buble({
      transforms: {
        letConst: false,
        arrow: true,
        classes: true,
        modules: false,
        templateString: false,
      },
      objectAssign: 'Object.assign',
    })],
};
