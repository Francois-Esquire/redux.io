const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify');

module.exports = {
  moduleName: 'redux.io',
  entry: 'lib/index.js',
  dest: 'dist/redux.io.js',
  format: 'umd',
  plugins: [
    buble({
      transforms: {
        templateString: false,
      },
      objectAssign: 'Object.assign',
    }),
    // uglify({
    //   output: {
    //     beautify: true,
    //   },
    // })
  ],
};
