import { describe, test, beforeEach, expect, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import request from 'supertest';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

function createDb() {
  const store = {};
  return {
    collection: (name) => ({
      doc: (id) => ({
        async get() {
          const col = store[name] || {};
          return { exists: id in col, data: () => col[id] };
        },
        async set(data) {
          store[name] = store[name] || {};
          store[name][id] = { ...(store[name][id] || {}), ...data };
        },
        collection: (sub) => ({
          doc: (sid) => ({
            async set(data) {
              const key = `${name}.${id}.${sub}`;
              store[key] = store[key] || {};
              store[key][sid] = data;
            },
          }),
          async get() {
            const key = `${name}.${id}.${sub}`;
            const docs = Object.entries(store[key] || {}).map(([sid, d]) => ({ id: sid, data: () => d }));
            return { docs };
          },
        }),
      }),
      orderBy: () => ({
        limit: () => ({
          async get() {
            const col = store[name] || {};
            const docs = Object.entries(col).map(([sid, d]) => ({ id: sid, data: () => d }));
            docs.sort((a, b) => (b.data().createdAt || 0) - (a.data().createdAt || 0));
            if (!docs.length) return { empty: true, docs: [] };
            return { empty: false, docs: [docs[0]] };
          },
        }),
      }),
    }),
  };
}

let db;
let app;

beforeEach(async () => {
  vi.resetModules();
  db = createDb();
  vi.mock('../../firebase.js', () => ({ getFirestore: () => db }));
  process.env.YOUTUBE_API_KEY = 'test';
  const mod = await import('../../server.js');
  app = mod.default || mod;
});

describe('session persistence', () => {
  test('queue saved to firestore is restored on restart', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    await request(app).post(`/sessions/${code}/join`).send({ name: 'Alice' });
    await request(app).post('/songs').send({ videoId: 'ABCDEFGHIJK', singer: 'Alice' });
    const first = await request(app).get('/queue');
    expect(first.body.queue.length).toBe(1);

    vi.resetModules();
    vi.mock('../../firebase.js', () => ({ getFirestore: () => db }));
    const mod2 = await import('../../server.js');
    const app2 = mod2.default || mod2;
    const second = await request(app2).get('/queue');
    expect(second.body.queue.length).toBe(1);
    expect(second.body.queue[0].videoId).toBe('ABCDEFGHIJK');
  });
});
