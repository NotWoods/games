/** @type {import('eslint').Linter.BaseConfig} */
const config = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-inner-declarations': 'off',
  },
  overrides: [
    {
      files: '*.cjs',
      env: {
        node: true,
      },
    },
    {
      files: ['*.test.ts', '*.test.js'],
      extends: ['plugin:testing-library/dom'],
    },
  ],
};

module.exports = config;
