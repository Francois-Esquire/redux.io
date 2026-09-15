import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/socket.io': { target: 'http://127.0.0.1:3000', ws: true },
      '/api': { target: 'http://127.0.0.1:3000' },
    },
  },
});
