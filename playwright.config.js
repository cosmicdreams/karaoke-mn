// playwright.config.js
// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: 'e2e',
  use: {
    baseURL: 'http://localhost:3000/',
    headless: true,
  },
};

export default config; 