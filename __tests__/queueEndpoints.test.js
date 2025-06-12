import { describe, test, beforeEach, expect, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import request from 'supertest';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

let app;

beforeEach(async () => {
  vi.resetModules();
  process.env.YOUTUBE_API_KEY = 'test';
  const mod = await import('../server.js');
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


  test('queue favors new singers even when one adds many songs', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    await request(app).post(`/sessions/${code}/join`).send({ name: 'A' });
    await request(app).post(`/sessions/${code}/join`).send({ name: 'B' });

    await request(app).post('/songs').send({ videoId: 'AAAAAAAAAAA', singer: 'A' });
    await request(app).post('/songs').send({ videoId: 'BBBBBBBBBBB', singer: 'A' });
    await request(app).post('/songs').send({ videoId: 'CCCCCCCCCCC', singer: 'A' });
    const res = await request(app).post('/songs').send({ videoId: 'DDDDDDDDDDD', singer: 'A' });
    expect(res.statusCode).toBe(200);
    await request(app).post('/songs').send({ videoId: 'EEEEEEEEEEE', singer: 'B' });

    const q = await request(app).get('/queue');
    expect(q.body.queue.map((s) => s.videoId)).toEqual([
      'AAAAAAAAAAA',
      'EEEEEEEEEEE',
      'BBBBBBBBBBB',
      'CCCCCCCCCCC',
      'DDDDDDDDDDD',
    ]);
  });

  test('delete removes song from queue', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    await request(app).post(`/sessions/${code}/join`).send({ name: 'A' });

    const res = await request(app)
      .post('/songs')
      .send({ videoId: 'VIDDEL12345', singer: 'A' });
    const id = res.body.id;

    await request(app).delete(`/songs/${id}`);

    const q = await request(app).get('/queue');
    expect(q.body.queue.length).toBe(0);
  });

  test('replace updates song videoId', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    await request(app).post(`/sessions/${code}/join`).send({ name: 'A' });

    const res = await request(app)
      .post('/songs')
      .send({ videoId: 'VIDOLD12345', singer: 'A' });
    const id = res.body.id;

    await request(app)
      .put(`/songs/${id}`)
      .send({ videoId: 'VIDNEW12345' });

    const q = await request(app).get('/queue');
    expect(q.body.queue[0].videoId).toBe('VIDNEW12345');
  });

  test('pause endpoint toggles queue paused state', async () => {
    await request(app).post('/sessions/pause').send({ paused: true });
    const q = await request(app).get('/queue');
    expect(q.body.paused).toBe(true);
  });
});
