import { describe, test, beforeEach, expect, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import request from 'supertest';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

vi.mock('../kjAuth.js', () => ({
  generateRegistration: vi.fn(),
  verifyRegistration: vi.fn(() => Promise.resolve(true)),
  generateAuth: vi.fn(),
  verifyAuth: vi.fn(() => Promise.resolve(true)),
  initAuth: vi.fn(() => Promise.resolve()),
}));

let app;

beforeEach(async () => {
  vi.resetModules();
  process.env.YOUTUBE_API_KEY = 'test';
  const mod = await import('../server.js');
  app = mod.default || mod;
});

describe('auth session cookies', () => {
  test('login sets session cookie', async () => {
    const res = await request(app).post('/auth/login/verify').send({});
    expect(res.body.verified).toBe(true);
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.startsWith('connect.sid'))).toBe(true);
  });
});
