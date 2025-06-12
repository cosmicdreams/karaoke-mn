/**
 * @vitest-environment jsdom
 */
import { describe, beforeEach, test, expect, vi } from 'vitest';
import './karaoke-app.js';

function flush() {
  return new Promise((r) => setTimeout(r, 0));
}

describe('kj-view startup login check', () => {
  let element;
  beforeEach(async () => {
    document.body.innerHTML = '';
    localStorage.clear();
    global.fetch = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ loggedIn: true }) })
    );
    element = document.createElement('kj-view');
    document.body.appendChild(element);
    await flush();
  });

  test('fetches /auth/session and updates login state', async () => {
    expect(fetch).toHaveBeenCalledWith('/auth/session');
    await flush();
    expect(element.loggedIn).toBe(true);
    expect(localStorage.getItem('kjLoggedIn')).toBe('true');
  });
});
