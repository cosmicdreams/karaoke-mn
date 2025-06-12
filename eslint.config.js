import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const importPlugin = require('eslint-plugin-import');
const storybook = require('eslint-plugin-storybook');

export default [
  {
    ignores: ['node_modules', 'dist'],
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
      storybook,
    },
    rules: {},
  },
]; 