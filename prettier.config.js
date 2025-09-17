/** @type {import('prettier').Config} */
const config = {
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  singleAttributePerLine: true,
  printWidth: 120,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/((?!(types|consts|structs|utils|_generated)).*)$',
    '^@/types(.*)$',
    '^@/consts(.*)$',
    '^@/structs(.*)$',
    '^@/utils(.*)$',
    '',
    '^@/_generated/(.*)$',
    '',
    '^[./]',
    '^[../]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
};

export default config;
