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
  // Capture console logs
  page.on('console', msg => console.log('Browser console:', msg.text()));
  page.on('pageerror', err => console.error('Browser error:', err));
  
  const cdp = await context.newCDPSession(page);
  await cdp.send('WebAuthn.enable');
  const { authenticatorId } = await cdp.send('WebAuthn.addVirtualAuthenticator', {
    options: { 
      protocol: 'ctap2', 
      transport: 'internal', 
      hasResidentKey: true, 
      hasUserVerification: true,
      isUserVerified: true
    },
  });

  await page.goto(adminUrl);
  const gotIt = page.getByRole('button', { name: 'Got It!' });
  if (await gotIt.isVisible().catch(() => false)) {
    await gotIt.click();
  }
  
  // Add debugging - take screenshot before clicking
  await page.screenshot({ path: 'test-results/before-register.png' });
  
  await page.getByRole('button', { name: 'Register Passkey' }).click();
  
  // Add debugging - take screenshot after clicking
  await page.screenshot({ path: 'test-results/after-register.png' });
  
  // Add a longer timeout and wait for network idle
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('Logged in as KJ')).toBeVisible({ timeout: 10000 });

  await page.reload();
  await page.getByRole('button', { name: 'Login with Passkey' }).click();
  await expect(page.getByText('Logged in as KJ')).toBeVisible();

  await cdp.send('WebAuthn.removeVirtualAuthenticator', { authenticatorId });
});

