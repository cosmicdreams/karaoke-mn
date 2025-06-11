import { test, expect } from '@playwright/test';
import { startServer } from './utils.js';

let server;

test.beforeEach(async () => {
  const started = startServer();
  server = started.server;
  await started.ready;
});

test.afterEach(() => {
  server?.kill();
});

test.describe('Main User-Facing UI', () => {
  test('should load and display the main navigation and guest join form', async ({ page }) => {
    await page.goto('/');
    const gotIt = page.getByRole('button', { name: 'Got It!' });
    if (await gotIt.isVisible().catch(() => false)) {
      await gotIt.click();
    }
    await page.waitForSelector('karaoke-app', { timeout: 10000 });
    await expect(page.locator('nav')).toHaveCount(1);
    await expect(page.getByText('KJ')).toBeVisible();
    await expect(page.getByText('Guest')).toBeVisible();
    await expect(page.getByText('Main')).toBeVisible();
    await expect(page.locator('guest-join-session')).toHaveCount(1);
    await expect(page.getByPlaceholder('Room Code')).toBeVisible();
    await expect(page.getByPlaceholder('Your Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Join session' })).toBeVisible();
  });
});

