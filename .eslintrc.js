export default {
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'plugin:storybook/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
  }
};
