/* eslint import/no-extraneous-dependencies: 0 */
const fs = require('fs');
const http = require('http');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaSend = require('koa-send');

const io = require('./io');

const publicPath = `${process.cwd()}/redux.io.messenger/public`;

module.exports = async function Server() {
  const PORT = process.env.PORT || 8080;

  const app = new Koa();
  const router = new KoaRouter();

  const assets = fs.readdirSync(publicPath).map(src => `/${src}`);
  const scripts = assets.filter(src => src.endsWith('.js'));

  router.get('/*', async (ctx) => {
    ctx.status = 200;
    ctx.set('Content-Type', 'text/html');
    ctx.body = `<!DOCTYPE html>
<html>
  <head>
    <title>redux.io.messenger</title>
  </head>
  <body>
    <div id="root"></div>
    ${scripts.map(src => `<script type="text/javascript" src="${src}"></script>`).join('')}
  </body>
</html>`;
  });

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

  return server.listen(PORT);
};
