import { test, expect } from '@playwright/test';
import { startServer } from './utils.js';

let server;
let adminUrl;

test.beforeEach(async () => {
  const started = startServer();
  server = started.server;
  adminUrl = await started.ready;
});

test.afterEach(() => {
  server?.kill();
});

test('register and login with passkey', async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: { protocol: 'ctap2', transport: 'usb', hasResidentKey: true, hasUserVerification: true },
  });

  await page.goto(adminUrl);
  const gotIt = page.getByRole('button', { name: 'Got It!' });
  if (await gotIt.isVisible().catch(() => false)) {
    await gotIt.click();
  }
  await page.getByRole('button', { name: 'Register Passkey' }).click();
  await expect(page.getByText('Logged in as KJ')).toBeVisible();

  await page.reload();
  await page.getByRole('button', { name: 'Login with Passkey' }).click();
  await expect(page.getByText('Logged in as KJ')).toBeVisible();

  await cdp.send('WebAuthn.removeVirtualAuthenticator', { authenticatorId });
});

