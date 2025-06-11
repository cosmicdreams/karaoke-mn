import { test, expect } from '@playwright/test';

test.describe('Main Screen', () => {
  test('should load and display the main elements', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Karaoke MN');
    await expect(page.locator('#player')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveText('Next Singers');
    await expect(page.locator('ol#next')).toHaveCount(1);
  });
}); 