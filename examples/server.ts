import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { Server } from 'socket.io';
import type { ClientEvents, Message, ServerEvents } from './events.js';

export function createDemoServer() {
  const http = createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('redux.io demo Socket.IO server\n');
  });
  const io = new Server<ClientEvents, ServerEvents>(http);
  const messages: Message[] = [];

  io.on('connection', socket => {
    socket.emit('history', messages);
    io.emit('presence', io.engine.clientsCount);
    socket.on('chat:send', (text, acknowledge) => {
      if (typeof acknowledge !== 'function') return;
      if (
        typeof text !== 'string' ||
        !text.trim() ||
        text.trim().length > 500
      ) {
        acknowledge({
          ok: false,
          error: 'Enter between 1 and 500 characters.',
        });
        return;
      }
      const message = {
        id: randomUUID(),
        text: text.trim(),
        sender: socket.id,
      };
      messages.push(message);
      if (messages.length > 100) messages.shift();
      io.emit('message', message);
      acknowledge({ ok: true, id: message.id });
    });
    socket.on('disconnect', () => io.emit('presence', io.engine.clientsCount));
  });

  return { http, io };
}
