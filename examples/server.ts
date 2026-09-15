import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { Server } from 'socket.io';
import type { ClientEvents, Message, ServerEvents } from './events.js';

export function createDemoServer() {
  const http = createServer((request, response) => {
    if (request.url === '/api/health') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          status: 'ok',
          clients: io.engine.clientsCount,
          messages: messages.length,
        }),
      );
      return;
    }
    response.writeHead(404);
    response.end('Not found');
  });
  const io = new Server<ClientEvents, ServerEvents>(http, {
    allowRequest: (request, callback) => {
      const origin = request.headers.origin;
      if (!origin) return callback(null, true);
      try {
        callback(
          null,
          ['127.0.0.1', 'localhost', '[::1]'].includes(
            new URL(origin).hostname,
          ),
        );
      } catch {
        callback(null, false);
      }
    },
  });
  const messages: Message[] = [];

  io.on('connection', socket => {
    socket.emit('history', messages);
    io.emit('presence', io.of('/').sockets.size);
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
    socket.on('disconnect', () => io.emit('presence', io.of('/').sockets.size));
  });

  return { http, io };
}
