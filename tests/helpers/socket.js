import { EventEmitter } from 'node:events';
import { vi } from 'vitest';

export function createClient() {
  const sockets = [];
  const client = vi.fn((url, options) => {
    const socket = new EventEmitter();
    socket.id = undefined;
    socket.nsp = '/';
    socket.connected = false;
    socket.active = false;
    socket.io = new EventEmitter();
    socket.io.uri = url;
    for (const [method, initial] of Object.entries({
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })) {
      let current = initial;
      socket.io[method] = vi.fn(value => {
        if (value === undefined) return current;
        current = value;
        return socket.io;
      });
    }
    socket.connect = socket.open = vi.fn(() => {
      socket.active = true;
      return socket;
    });
    socket.disconnect = socket.close = vi.fn(() => {
      socket.connected = false;
      socket.active = false;
      return socket;
    });
    socket.compress = vi.fn(() => socket);
    socket.emit = vi.fn(() => socket);
    socket.receive = (event, ...args) => {
      if (event === 'connect') {
        socket.connected = true;
        socket.id = 'test-id';
      }
      if (event === 'disconnect') {
        socket.connected = false;
        socket.id = undefined;
      }
      EventEmitter.prototype.emit.call(socket, event, ...args);
    };
    socket.options = options;
    sockets.push(socket);
    return socket;
  });
  return { client, sockets };
}
