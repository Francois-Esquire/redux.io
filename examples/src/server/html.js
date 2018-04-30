import fs from 'fs';
import url from 'url';
import stream from 'stream';

import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import Application from '../components/Application';

const title = 'redux.io examples';

const publicDir = `${process.cwd()}/public`;

const assets = new Map([
  ['/vendor.js', `${publicDir}/vendor.js`],
  ['/bundle.js', `${publicDir}/bundle.js`],
]);

const scripts = Array.from(assets.keys());

export default function render(request, response) {
  const { pathname } = url.parse(request.url);

  if (assets.has(pathname)) {
    response.setHeader('Content-Type', 'text/javascript');
    fs.createReadStream(assets.get(pathname)).pipe(response);
    return;
  }

  response.setHeader('Content-Type', 'text/html');

  const htmlStream = new stream.Transform({
    transform(chunk, enc, cb) {
      cb(undefined, chunk);
    },
  });

  htmlStream.on('end', () =>
    response.end(
      `</div>${scripts
        .map(src => `<script src="${src}"></script>`)
        .join('')}</body></html>`,
      200,
    ),
  );

  htmlStream.write(
    `<!DOCTYPE html><html><head><title>${title}</title><script src="/socket.io/socket.io.js"></script></head><body><div id="app">`,
  );

  renderToNodeStream(
    <StaticRouter path={pathname} context={{}}>
      <Application />
    </StaticRouter>,
  ).pipe(htmlStream);

  htmlStream.pipe(response);
}
