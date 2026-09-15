import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      '.build/**',
      'examples/dist/**',
      'coverage/**',
      'tests/types/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['tests/**/*.mjs'],
    languageOptions: { globals: { fetch: 'readonly' } },
  },
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
  })),
  {
    files: ['lib/**/*.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    files: [
      'examples/**/*.ts',
      'examples/**/*.tsx',
      'tests/**/*.ts',
      'tests/**/*.tsx',
    ],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
      },
    },
  },
  {
    files: ['lib/**/*.js', 'tests/**/*.js', '*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: { console: 'readonly', setTimeout: 'readonly' },
    },
  },
  {
    files: ['tests/**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { process: 'readonly', __dirname: 'readonly' },
    },
  },
];
