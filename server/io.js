'use strict';

module.exports = function IO (io, app) {
  io.use((socket, next) => {
    const { id, request, conn, client, rooms } = socket;

    socket.on('message', (message, fn = () => undefined) => {
      console.log('Client has sent a message: ', message);
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
