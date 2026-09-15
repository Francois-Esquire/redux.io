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
      thresholds: { statements: 90, branches: 80, functions: 90, lines: 90 },
    },
  },
});
