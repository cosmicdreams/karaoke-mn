// playwright.config.js
// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: 'tests/e2e',
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000/',
    headless: true,
  },
};

export default config;

