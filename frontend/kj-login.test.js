/**
 * @vitest-environment jsdom
 */
import { describe, beforeEach, test, expect, vi } from 'vitest';
import './kj-login.js';

function flush() {
  return new Promise((r) => setTimeout(r, 0));
}

describe('kj-login component', () => {
  let element;
  beforeEach(async () => {
    document.body.innerHTML = '';
    global.fetch = vi.fn();
    global.navigator = { credentials: { create: vi.fn(), get: vi.fn() } };
    element = document.createElement('kj-login');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  test('register button triggers registration flow', async () => {
    const loginSpy = vi.fn();
    element.addEventListener('login', loginSpy);
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve({}) });
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ verified: true }) });
    navigator.credentials.create.mockResolvedValue({});
    const [regBtn] = element.shadowRoot.querySelectorAll('button');
    regBtn.click();
    await flush();
    expect(navigator.credentials.create).toHaveBeenCalled();
    expect(fetch.mock.calls[0][0]).toBe('/auth/register/options');
    expect(fetch.mock.calls[1][0]).toBe('/auth/register/verify');
    expect(loginSpy).toHaveBeenCalled();
    expect(element.loggedIn).toBe(true);
  });

  test('login button triggers authentication flow', async () => {
    const loginSpy = vi.fn();
    element.addEventListener('login', loginSpy);
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve({}) });
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve({ verified: true }) });
    navigator.credentials.get.mockResolvedValue({});
    const [, loginBtn] = element.shadowRoot.querySelectorAll('button');
    loginBtn.click();
    await flush();
    expect(navigator.credentials.get).toHaveBeenCalled();
    expect(fetch.mock.calls[0][0]).toBe('/auth/login/options');
    expect(fetch.mock.calls[1][0]).toBe('/auth/login/verify');
    expect(loginSpy).toHaveBeenCalled();
    expect(element.loggedIn).toBe(true);
  });
});
