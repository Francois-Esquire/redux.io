const webpack = require('webpack');
const path = require('path');

const debug = process.env.NODE_ENV !== 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(debug ? 'development' : 'production'),
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
];

const resolve = {
  modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  descriptionFiles: ['package.json'],
  extensions: ['*', '.js', '.jsx'],
  alias: {
    'redux.io': path.resolve(__dirname, 'redux.io.es.js'),
  },
};

const resolveLoader = {
  modules: ['node_modules'],
  moduleExtensions: ['-loader'],
};

const app = ['./client/index.js'];

if (debug) {
  app.unshift(
    'webpack-hot-middleware/client?path=/__hmr&timeout=2000&name=app',
    'react-hot-loader/patch');

  plugins.push(
    new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  plugins,
  resolve,
  resolveLoader,
  devtool: debug ? 'cheap-module-eval-source-map' : 'source-map',
  name: 'app',
  target: 'web',
  context: __dirname,
  entry: {
    app,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel',
        options: {
          babelrc: false,
          presets: ['react', ['env', {
            debug: false,
            spec: true,
            useBuiltIns: true,
            modules: false,
          }]],
          plugins: [
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
            'transform-do-expressions'],
        },
      },
    }],
  },
};
