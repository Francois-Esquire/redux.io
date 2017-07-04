import socketIO from 'socket.io';

const PORT = 8080;

const io = socketIO().listen(PORT);

const messages = [];

function createMessage(by, content, channel) {
  return {
    id: [0,0,0,0].map(n => `${Math.random()}`).join(':')
    by,
    content,
    channel,
  };
}

var chat = io.of('/chat');

chat.sockets.on('connection', function (socket) {
  socket.on('message:send', function ({ whoami, content, channel }) {
    const fn = arguments[arguments.length - 1];
    const message = createMessage(whoami, content, channel);
    socket.to(channel).emit('message:new', { message });
    if (fn && typeof fn === 'function') fn({ message });
  });

  socket.on('typing:state', function (typing, whoami) {
    socket.broadcast.to(channel).emit('typing', { typing, user: whoami });
  });

  socket.on('channel', function (channel, whoami) {
    socket.join(channel);
    socket.to(channel).emit('channel:join', whoami);
    socket.emit('messages', {
      messages: messages.filter(m => m.channel === channel)
    });
  });
  socket.on('channel:change', function (next, channel, whoami) {
    socket.leave(channel);
    socket.to(channel).emit('channel:leave', whoami);
    socket.join(next);
    socket.to(next).emit('channel:join', whoami);
  });

  socket.on('disconnect', function() {
    console.log('socket.on("disconnect")', arguments);
  });
});
