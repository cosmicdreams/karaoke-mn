import { describe, beforeEach, test, expect, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import request from 'supertest';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

let app;

beforeEach(async () => {
  vi.resetModules();
  process.env.YOUTUBE_API_KEY = 'test';
  vi.mock('../../kjAuth.js', () => ({
    generateRegistration: vi.fn(),
    verifyRegistration: vi.fn(() => true),
    generateAuth: vi.fn(),
    verifyAuth: vi.fn(() => true),
    initAuth: vi.fn(() => Promise.resolve()),
  }));
  const mod = await import('../../server.js');
  app = mod.default || mod;
});

describe('auth session endpoints', () => {
  test('login sets cookie and logout clears it', async () => {
    const agent = request.agent(app);
    const login = await agent.post('/auth/login/verify').send({});
    expect(login.body.verified).toBe(true);

    const sess = await agent.get('/auth/session');
    expect(sess.body.loggedIn).toBe(true);

    await agent.post('/auth/logout');
    const after = await agent.get('/auth/session');
    expect(after.body.loggedIn).toBe(false);
  });
});
