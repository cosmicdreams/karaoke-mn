import { test, expect } from '@playwright/test';

test.describe('Main User-Facing UI', () => {
  test('should load and display the main navigation and guest join form', async ({ page }) => {
    await page.goto('/');
    // Wait for karaoke-app to be present in the DOM
    await page.waitForSelector('karaoke-app', { timeout: 10000 });
    // Check for navigation bar and links
    await expect(page.locator('nav')).toHaveCount(1);
    await expect(page.getByText('KJ')).toBeVisible();
    await expect(page.getByText('Guest')).toBeVisible();
    await expect(page.getByText('Main')).toBeVisible();
    // Check for guest-join-session form (default route)
    await expect(page.locator('guest-join-session')).toHaveCount(1);
    await expect(page.getByPlaceholder('Room Code')).toBeVisible();
    await expect(page.getByPlaceholder('Your Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Join session' })).toBeVisible();
  });
}); 