/** @type {import('eslint').Linter.BaseConfig} */
const config = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  env: {
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    'svelte/no-inner-declarations': 'off',
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
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    {
      files: ['*.test.ts', '*.test.js'],
      extends: ['plugin:testing-library/dom'],
      rules: {
        'testing-library/no-node-access': 'off',
      },
    },
  ],
};

module.exports = config;
