import createHunt from './io/hunt';

export default function createIo(server, options = {}) {
  const io = require('socket.io')(server);

  if (options.hunt) createHunt(io);
}
