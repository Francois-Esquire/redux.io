import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    environment: 'jsdom',
    setupFiles: ['tests/setup.js'],
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.js'],
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
