import { test, expect } from '@playwright/test';
import { startServer } from './utils.js';

let server;
let adminUrl;

// Start a fresh server before each test
test.beforeEach(async () => {
  const started = startServer();
  server = started.server;
  adminUrl = await started.ready;
});

test.afterEach(() => {
  server?.kill();
});

test('login persists across reload', async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
    },
  });

  await page.goto(adminUrl);
  const gotIt = page.getByRole('button', { name: 'Got It!' });
  if (await gotIt.isVisible().catch(() => false)) {
    await gotIt.click();
  }

  await page.getByRole('button', { name: 'Register Passkey' }).click();
  await page.waitForLoadState('networkidle');
  await expect(
    page.getByRole('button', { name: 'Start a new karaoke session' })
  ).toBeVisible({ timeout: 10000 });

  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(
    page.getByRole('button', { name: 'Start a new karaoke session' })
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole('button', { name: 'Register Passkey' }).first()
  ).toBeHidden();

  await cdp.send('WebAuthn.removeVirtualAuthenticator', { authenticatorId });
});


test('queue persists across page reload', async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
    },
  });

  await page.goto(adminUrl);
  const gotIt = page.getByRole('button', { name: 'Got It!' });
  if (await gotIt.isVisible().catch(() => false)) {
    await gotIt.click();
  }

  await page.getByRole('button', { name: 'Register Passkey' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Start a new karaoke session' }).click();
  await page.waitForSelector('kj-control-panel');
  await page.getByPlaceholder('Singer').fill('Bob');
  await page.getByPlaceholder('Video ID').fill('VID12345');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.locator('kj-control-panel li')).toContainText('Bob');

  await page.reload();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('kj-control-panel li')).toContainText('Bob');

  await cdp.send('WebAuthn.removeVirtualAuthenticator', { authenticatorId });
});
