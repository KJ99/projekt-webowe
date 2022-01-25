/** eslint disable */
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'no-await-in-loop': 2,
    'no-unreachable': 2,
    'no-unused-vars': 2,
    'no-use-before-define': 2,
    'valid-typeof': 2,
    'arrow-parens': 2,
    'arrow-spacing': 2,
    'brace-style': 2,
    'comma-dangle': 2,
    'comma-spacing': 2,
    'dot-location': 2,
    'function-paren-newline': 2,
    'max-len': 2,
    'no-trailing-spaces': 2,
    semi: 2
  }
};
