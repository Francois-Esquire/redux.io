module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    jsx: true,
  },
  plugins: [
    'react',
    'jsx-a11y',
    'import',
    'babel'],
  rules: {
    'jsx-a11y/href-no-hash': 0,
    'react/prefer-stateless-function': [1, { ignorePureComponents: true }],
    'react/no-multi-comp': 0,
    'react/jsx-closing-bracket-location': [1, 'after-props'],
    'react/prop-types': [1, {
      ignore: ['dispatch'],
    }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-unresolved': [2, { commonjs: true }],
    'linebreak-style': 1,
    'global-require': 0,
  }
};
