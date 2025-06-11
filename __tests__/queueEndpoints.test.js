import { describe, test, beforeEach, expect, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import request from 'supertest';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

let app;

beforeEach(async () => {
  vi.resetModules();
  process.env.YOUTUBE_API_KEY = 'test';
  const mod = await import('../backend/server.js');
  app = mod.default || mod;
});

describe('queue endpoints', () => {
  test('skip moves song out of queue', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    await request(app).post(`/sessions/${code}/join`).send({ name: 'A' });
    const add = await request(app)
      .post('/songs')
      .send({ videoId: 'VID1', singer: 'A' });
    const id = add.body.id;

    await request(app).post(`/songs/${id}/skip`);

    const q = await request(app).get('/queue');
    expect(q.body.queue.length).toBe(0);
  });

  test('reorder updates queue order', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    await request(app).post(`/sessions/${code}/join`).send({ name: 'A' });

    const res1 = await request(app)
      .post('/songs')
      .send({ videoId: 'AAAAAAAAAAA', singer: 'A' });
    const res2 = await request(app)
      .post('/songs')
      .send({ videoId: 'BBBBBBBBBBB', singer: 'A' });

    await request(app)
      .post('/songs/reorder')
      .send({ order: [res2.body.id, res1.body.id] });

    const q = await request(app).get('/queue');
    expect(q.body.queue.map((s) => s.id)).toEqual([res2.body.id, res1.body.id]);
  });
});
