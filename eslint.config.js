import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier
    ],
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.d.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
      'simple-import-sort': simpleImportSort
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error', // Disallow usage of any
      'no-duplicate-imports': 'error', // Imports should be on one line
      'no-console': 'warn',
      'prefer-destructuring': ['error', { object: true, array: true }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Packages `react` related packages come first.
            ['^react', '^@?\\w'],
            // Internal packages.
            ['^(@|components)(/.*|$)'],
            // Side effect imports.
            ['^\\u0000'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.?(css)$']
          ]
        }
      ],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'always',
          children: 'never',
          propElementValues: 'always'
        }
      ],
      // Guards against stupidity
      'no-self-compare': 'error',
      'no-unreachable-loop': 'error',
      'no-template-curly-in-string': 'error', // Catches "${}" template strings
      'default-case': ['error', { commentPattern: '^skip\\sdefault' }], // require default switch case
      'default-case-last': 'error' // enforce default switch case last
    }
  }
);
