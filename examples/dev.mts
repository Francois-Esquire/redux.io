import process from 'node:process';
import { startDemo } from './devServer.mjs';

const demo = await startDemo();
demo.vite.printUrls();
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void demo.close();
  });
}
