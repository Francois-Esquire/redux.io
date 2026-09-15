import js from '@eslint/js';

export default [
  { ignores: ['dist/**', 'examples/**', 'coverage/**'] },
  js.configs.recommended,
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
