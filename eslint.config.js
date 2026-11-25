import { reactLint } from '@openspace/shared-configs/eslint/react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.d.ts'],
    extends: [reactLint],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      // Only the classic hook rules; the recommended set of the plugin also contains the
      // React Compiler rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': 'error'
    }
  },
  {
    // Console output is only allowed in the third-party license generator script.
    files: ['scripts/generateThirdParty.ts'],
    rules: {
      'no-console': 'off'
    }
  }
);
