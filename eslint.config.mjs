// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'linebreak-style': [
        'warn',
        'unix'
      ],
      'eol-last': [
        'warn',
        'always'
      ],
      'quotes': [
        'warn',
        'single',
        {
          'allowTemplateLiterals': true
        }
      ],
      'object-curly-spacing': [
        'warn',
        'always'
      ],
      'array-bracket-spacing': [
        'warn',
        'never'
      ],
      'block-spacing': [
        'warn',
        'always'
      ],
      'key-spacing': [
        'warn',
        {
          'beforeColon': false,
          'afterColon': true,
          'mode': 'strict'
        }
      ],
      'func-call-spacing': [
        'warn',
        'never'
      ],
      'no-array-constructor': 'warn',
      'no-new-object': 'warn',
      'camelcase': [
        'warn',
        {
          'properties': 'never',
          'ignoreDestructuring': true
        }
      ],
      'no-duplicate-case': 'warn',
      'no-duplicate-imports': 'warn',
      'no-trailing-spaces': [
        'warn',
        {
          'ignoreComments': true
        }
      ],
      'no-redeclare': 'warn',
      'no-var': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'space-before-blocks': 'warn',
      'space-before-function-paren': 'warn',
      'arrow-spacing': ['warn', { 'before': true, 'after': true }],
      'new-parens': 'warn',
      'no-dupe-keys': 'warn',
      'semi': 'warn',
      'curly': 'error'
    }
  }
);

