const socketIO = require('socket.io');

module.exports = function IO(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('io connected');
  });

  const messages = [];

  function createMessage(by, content, channel) {
    return {
      id: [0, 0, 0, 0].map(() => `${Math.random()}`).join(':'),
      by,
      content,
      channel,
    };
  }

  const chat = io.of('/chat');

  chat.on('connection', (socket) => {
    console.log('socket connected');

    socket.on('message:send', ({ whoami, content, channel }, fn) => {
      const message = createMessage(whoami, content, channel);
      socket.to(channel).emit('message:new', { message });
      if (fn && typeof fn === 'function') fn({ message });
    });

    socket.on('typing:state', (typing, whoami, channel) => {
      socket.broadcast.to(channel).emit('typing', { typing, user: whoami });
    });

    socket.on('channel', (channel, whoami) => {
      socket.join(channel);
      socket.to(channel).emit('channel:join', whoami);
      socket.emit('messages', {
        messages: messages.filter(m => m.channel === channel),
      });
    });
    socket.on('channel:change', (next, channel, whoami) => {
      socket.leave(channel);
      socket.to(channel).emit('channel:leave', whoami);
      socket.join(next);
      socket.to(next).emit('channel:join', whoami);
    });

    socket.on('disconnect', () => {
      // console.log('socket.on("disconnect")', arguments);
    });
  });

  return io;
};
