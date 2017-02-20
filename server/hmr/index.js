'use strict';

require('babel-register')({
  ignore: /(node_modules)/
});

const webpack = require('webpack');
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const { app, server, io } = require('../');

const webpackConfig = require('./../webpack.config.js');

webpackConfig.entry.app = ([
  'webpack-hot-middleware/client?path=/__hmr&timeout=2000&dynamicPublicPath=true',
  'react-hot-loader/patch',
  `${__dirname}/hmr.js`
]);

webpackConfig.output.publicPath = '';

const webpackCompiler = webpack(webpackConfig);

const webpackServer = webpackMiddleware(webpackCompiler, {
  publicPath: webpackConfig.output.publicPath,
  serverSideRender: true,
  lazy: false,
  quiet: false,
  stats: {
    errors: true,
    colors: true
  }
});


app.use(webpackServer);

app.use(webpackHotMiddleware(webpackCompiler, {
  log: console.log,
  path: '/__hmr',
  heartbeat: 1000
}));
