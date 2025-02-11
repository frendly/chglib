import html from '@html-eslint/eslint-plugin';

export default [
  {
    ...html.configs['flat/recommended'],
    files: ['**/*.html'],
    rules: {
      // Must be defined. If not, all recommended rules will be lost
      ...html.configs['flat/recommended'].rules,
      '@html-eslint/element-newline': 'off',
      '@html-eslint/indent': 'off',
    },
  },
];
