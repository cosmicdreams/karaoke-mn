import { describe, test, beforeEach, expect, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import request from 'supertest';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

let app;

const sessionData = { code: 'PURPLE-RAIN', preparedContent: { msg: 'hi' }, createdAt: Date.now() };
const singersGet = vi.fn(() => Promise.resolve({ docs: [] }));
const mockDb = {
  collection: vi.fn(() => ({
    doc: vi.fn(() => ({
      set: vi.fn(),
      collection: vi.fn(() => ({ get: singersGet }))
    })),
    orderBy: vi.fn(() => ({
      limit: vi.fn(() => ({
        get: vi.fn(() =>
          Promise.resolve({ empty: false, docs: [{ id: 'abc', data: () => sessionData }] })
        )
      }))
    }))
  }))
};

vi.mock('../firebase.js', () => ({ getFirestore: () => mockDb }));

beforeEach(async () => {
  vi.resetModules();
  process.env.YOUTUBE_API_KEY = 'test';
  const mod = await import('../server.js');
  app = mod.default || mod;
});

describe('sessions endpoints', () => {
  test('current session loads from Firestore', async () => {
    const res = await request(app).get('/sessions/current');
    expect(res.statusCode).toBe(200);
    expect(res.body.preparedContent).toEqual(sessionData.preparedContent);
  });
});
