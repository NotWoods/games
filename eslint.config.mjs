// @ts-check
import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  {
    ignores: ['*/.svelte-kit/**', 'dist/**'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: globals.browser,

      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        extraFileExtensions: ['.svelte'],
      },
    },

    rules: {
      'svelte/no-inner-declarations': 'off',
    },
  },
  {
    files: ['**/*.cjs', '**/.eleventy.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: { parser: ts.parser },
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.js'],
    plugins: {
      'testing-library': fixupPluginRules(testingLibrary),
    },
    rules: {
      'testing-library/no-node-access': 'off',
    },
  },
);
