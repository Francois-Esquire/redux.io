export default function createServer(port = 3000) {
  const io = require('socket.io')();

  io.on('connect', socket => {
    socket.emit('message', 'yoooo');
    socket.emit('pong', 30);
  });

  io.listen(port);

  return io;
}
