import buble from 'rollup-plugin-buble';

import pkg from './package.json';

export default {
  input: 'lib/index.js',
  output: [
    { file: pkg.browser, format: 'umd', exports: 'auto', name: 'redux.io' },
    { file: pkg.main, format: 'cjs' },
    { file: 'redux.io.messenger/client/redux.io.es.js', format: 'es' }],
  external: Object.keys(pkg.peerDependencies).concat(Object.keys(pkg.dependencies)),
  plugins: [
    buble({
      transforms: {
        letConst: true,
        arrow: true,
        classes: true,
        modules: false,
        spreadRest: true,
        destructuring: true,
        parameterDestructuring: true,
        defaultParameter: true,
        templateString: false,
      },
      jsx: 'React.createElement',
      objectAssign: 'Object.assign',
    })],
};
