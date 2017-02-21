'use strict';

module.exports = function IO (io, app) {
  io.use((socket, next) => {
    const { id, request, conn, client, rooms } = socket;

    socket.on('message', (message, fn = () => undefined) => {
      const { type, name, action, data } = JSON.parse(message);
      console.log(`Client has sent a message.\n type : ${
        type
      },\n name : ${
        name
      },\n action : ${
        action
      },\n data: ${
        data
      }.`);

      fn(JSON.stringify({ message: 'message received' }));
    });

    return next();
  });

  io.sockets.on('connection', socket => {
    console.log(`New client connected - socket.id: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Client was disconnected - socket.id: ${socket.id}`);
    });
  });
};
