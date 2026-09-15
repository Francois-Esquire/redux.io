export default {
  '{lib,tests}/**/*.{js,cjs,mjs}': ['eslint --fix', 'prettier --write'],
  './*.mjs': ['eslint --fix', 'prettier --write'],
  './{package.json,README.md,CHANGELOG.md}': 'prettier --write',
  '.github/workflows/*.{yml,yaml}': 'prettier --write',
};
