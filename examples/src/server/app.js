import http from 'http';
import url from 'url';

import html from './html';
import createIo from './io';
import wss from './ws';

const port = process.env.PORT || 3000;

const server = http.createServer(html);

server.on('upgrade', (request, socket, head) => {
  const { pathname } = url.parse(request.url);

  if (pathname === '/example') {
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws);
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, error => {
  if (error) console.error(error);
  else {
    console.log('server listening on port %s', port);

    createIo(server, { hunt: true });
  }
});
