import { describe, test, beforeEach, expect, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import request from 'supertest';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

let app;

const now = Date.now();
const sessionData = {
  code: 'PURPLE-RAIN',
  preparedContent: { msg: 'hi' },
  createdAt: now,
  paused: true,
  phase2Start: now - 1000,
  queue: [
    { id: 's1', videoId: 'AAA', singer: 'A', addedAt: now - 3000 },
    { id: 's2', videoId: 'BBB', singer: 'A', addedAt: now - 2000 },
    { id: 's3', videoId: 'CCC', singer: 'B', addedAt: now - 1000 },
  ],
  singerStats: { A: { songsSung: 5 }, B: { songsSung: 1 } },
};
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

  test('restores paused and phase2 flags', async () => {
    const res = await request(app).get('/queue');
    expect(res.body.paused).toBe(true);
    expect(res.body.queue.map((s) => s.id)).toEqual(['s3', 's1', 's2']);
  });
});
