'use strict';

require('babel-register')({
  ignore: /(node_modules)/
});

const webpack = require('webpack');
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const { app, server, io } = require('../');

const webpackConfig = require('./../../webpack.config.js');

webpackConfig.entry.app = ([
  'webpack-hot-middleware/client?path=/__hmr&timeout=2000&dynamicPublicPath=true',
  'react-hot-loader/patch',
  `${__dirname}/hmr.js`
]);

webpackConfig.entry.vendor = webpackConfig.entry['vendor'].concat([
  'redux-devtools',
  'redux-devtools-dispatch',
  'redux-devtools-log-monitor',
  'redux-devtools-multiple-monitors',
  'redux-devtools-dock-monitor',
  'redux-logger',
  'react-hot-loader'
]);

webpackConfig.plugins = webpackConfig.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
]);

// webpackConfig.devtools = 'eval';

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

app.use('/*', (req, res) => {
  const output = res.locals.webpackStats.toJson().assetsByChunkName;

  const assets = {
    vendor: output.vendor instanceof Array ? output.vendor.map(path => `<script src="${path}"></script>`).join('') : `<script src="${output.vendor}"></script>`,
    manifest: `<script src="${output.manifest}"></script>`,
    js: output.app.filter(path => path.endsWith('.js')).map(path => `<script src="${path}"></script>`),
    css: output.app.filter(path => path.endsWith('.css')).map(path => `<link rel="stylesheet" href="${path}" />`)
  };

  const title = 'redux.io';

  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ title }</title>

    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    ${ assets.manifest + assets.vendor }
    ${ assets.css }
    <script>
      window.__INITIAL_STATE__ = ${
        JSON.stringify({})
      }
    </script>
  </head>
  <body>
    <div id="app"></div>
    ${ assets.js }
  </body>
</html>
  `;

  res.status(200).send(html);
});
