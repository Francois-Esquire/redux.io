module.exports = {
  extends: ['airbnb', 'plugin:ava/recommended', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    jsx: true,
  },
  env: {
    es6: true,
  },
  plugins: ['babel', 'import', 'react', 'jsx-a11y', 'ava', 'prettier'],
  rules: {
    'no-underscore-dangle': 0,
    'jsx-a11y/href-no-hash': 0,
    'react/sort-comp': 0,
    'react/prop-types': [
      1,
      {
        ignore: ['dispatch'],
      },
    ],
    'import/no-unresolved': [2, { commonjs: true }],
    'import/no-extraneous-dependencies': 0,
    'global-require': 0,
    indent: 0,
    'prettier/prettier': 2,
  },
};
