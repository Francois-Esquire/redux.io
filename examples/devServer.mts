import { fileURLToPath } from 'node:url';
import type { AddressInfo } from 'node:net';
import { createServer as createViteServer, type ViteDevServer } from 'vite';
import { createDemoServer } from './server.js';

export async function startDemo(port = 5173) {
  const backend = createDemoServer();
  await new Promise<void>((resolve, reject) => {
    backend.http.once('error', reject);
    backend.http.listen(0, '127.0.0.1', resolve);
  });
  const target = `http://127.0.0.1:${(backend.http.address() as AddressInfo).port}`;
  let vite: ViteDevServer | undefined;
  let closing: Promise<void> | undefined;
  function close() {
    closing ??= (async () => {
      await vite?.waitForRequestsIdle();
      await new Promise<void>(resolve => backend.io.close(() => resolve()));
      await vite?.close();
    })();
    return closing;
  }
  try {
    vite = await createViteServer({
      configFile: fileURLToPath(new URL('./vite.config.mts', import.meta.url)),
      server: {
        port,
        proxy: { '/socket.io': { target, ws: true }, '/api': { target } },
      },
    });
    await vite.listen();
    return { vite, backend, close };
  } catch (error) {
    await close();
    throw error;
  }
}
