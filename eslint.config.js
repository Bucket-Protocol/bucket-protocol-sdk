import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  {
    ignores: ['dist', '.turbo', 'artifacts', 'cache', 'coverage*', 'src/_generated'],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'),
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      eqeqeq: 'error',
      'no-console': ['error', { allow: ['error'] }],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'error',
    },
  },
];

export default config;
