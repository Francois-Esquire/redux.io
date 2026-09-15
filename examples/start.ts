import { createDemoServer } from './server.js';

const { http, io } = createDemoServer();
http.listen(3000, '127.0.0.1', () => {
  console.log('Socket.IO demo server listening on http://127.0.0.1:3000');
});
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => io.close());
}
