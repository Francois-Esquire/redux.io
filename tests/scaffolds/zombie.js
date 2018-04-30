import http from 'http';

import createZombieland from '../../examples/src/server/io/hunt';

export default function zombieLand(port = 3000) {
  const server = http.createServer();

  server.listen(port, error => {
    if (error === undefined) {
      const io = require('socket.io')(server);

      createZombieland(io);
    }
  });

  return server;
}
