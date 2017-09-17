const fs = require('fs');
const http = require('http');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaSend = require('koa-send');

const io = require('./io');

const debug = process.env.NODE_ENV !== 'production';

const publicPath = `${process.cwd()}/public`;

module.exports = async function Server() {
  const PORT = process.env.PORT || 8080;

  const app = new Koa();
  const router = new KoaRouter();

  const assets = fs.readdirSync(publicPath).map(src => `/${src}`);
  const css = assets.filter(src => src.endsWith('.css'));
  const scripts = assets.filter(src => src.endsWith('.js'));

  router.get('/*', async (ctx) => {
    ctx.status = 200;
    ctx.set('Content-Type', 'text/html');
    ctx.body = `<!DOCTYPE html>
<html>
  <head>
    <title>redux.io.messenger</title>
    ${css.map(src => `<link rel="stylesheet" href="${src}" />`).join('')}
  </head>
  <body>
    <div id="root"></div>
    ${scripts.map(src => `<script type="text/javascript" src="${src}"></script>`).join('')}
  </body>
</html>`;
  });

  if (debug) {
    const webpack = {
      config: require('../webpack.config'),
    };

    webpack.config.output.publicPath = `http://localhost:${PORT}/`;

    app.use(require('koa-webpack')(Object.assign(webpack, {
      compiler: require('webpack')(webpack.config),
      hot: {
        path: '/__hmr',
        heartbeat: 1000,
      },
      dev: {
        hot: true,
        lazy: false,
        serverSideRender: true,
        publicPath: webpack.config.output.publicPath,
        watchOptions: {
          aggregateTimeout: 1200,
        },
        noinfo: false,
        quiet: false,
        stats: {
          colors: true,
        },
      },
    })));
  }

  app
    .use(async (ctx, next) => {
      try { await next(); } catch (e) {
        ctx.status = 500;
        ctx.body = `There was an error. Please try again later.\n\n${e.message}`;
      }
    })
    .use(async (ctx, next) => {
      if (ctx.path === '/favicon.ico') {
        if (ctx.status === 404) ctx.status = 204;
      } else if (assets.indexOf(ctx.path) >= 0) {
        try {
          await KoaSend(ctx, ctx.path, { root: publicPath });
        } catch (e) { /**/ }
      } else await next();
    })
    .use(router.routes())
    .use(router.allowedMethods());


  const server = http.createServer(app.callback());

  io(server);

  return server.listen(PORT, (error) => {
    if (error) console.log(error);
    else console.log(`server listening on port: ${PORT}`);
  });
};
