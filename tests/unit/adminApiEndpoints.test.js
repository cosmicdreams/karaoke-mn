import { describe, test, beforeEach, expect, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import request from 'supertest';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

let app;

beforeEach(async () => {
  vi.resetModules();
  process.env.YOUTUBE_API_KEY = 'test';
  const mod = await import('../../server.js');
  app = mod.default || mod;
});

describe('admin api endpoints', () => {
  test('returns session state', async () => {
    const session = await request(app).post('/sessions');
    const { id, code } = session.body;

    const res = await request(app).get('/api/session');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.code).toBe(code);
    expect(res.body.queue).toEqual([]);
  });

  test('add song via api and reorder', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    await request(app).post(`/sessions/${code}/join`).send({ name: 'A' });

    const res1 = await request(app)
      .post('/api/songs')
      .send({ videoId: 'AAA111AAA11', singer: 'A' });
    const res2 = await request(app)
      .post('/api/songs')
      .send({ videoId: 'BBB222BBB22', singer: 'A' });

    await request(app)
      .post('/api/songs/reorder')
      .send({ order: [res2.body.id, res1.body.id] });

    const q = await request(app).get('/api/queue');
    expect(q.body.queue.map((s) => s.id)).toEqual([res2.body.id, res1.body.id]);
  });

  test('skip via api', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    await request(app).post(`/sessions/${code}/join`).send({ name: 'A' });

    const res = await request(app)
      .post('/api/songs')
      .send({ videoId: 'SKIPME12345', singer: 'A' });
    const id = res.body.id;

    await request(app).post(`/api/songs/${id}/skip`);

    const q = await request(app).get('/api/queue');
    expect(q.body.queue.length).toBe(0);
  });
});
