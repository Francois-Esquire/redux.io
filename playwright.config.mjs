import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run examples:dev',
    url: 'http://127.0.0.1:5173/api/health',
    reuseExistingServer: false,
    timeout: 60000,
  },
});
