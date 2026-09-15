export default {
  '{lib,tests,examples}/**/*.{js,cjs,mjs,ts,tsx,mts}': [
    'eslint --fix',
    'prettier --write',
  ],
  './*.mjs': ['eslint --fix', 'prettier --write'],
  './{package.json,tsconfig.build.json,README.md,CHANGELOG.md}':
    'prettier --write',
  'examples/**/*.{json,md,html,css}': 'prettier --write',
  '.github/workflows/*.{yml,yaml}': 'prettier --write',
};
