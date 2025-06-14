import { describe, test, beforeEach, expect, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import request from 'supertest';

let app;

describe('end-to-end server', () => {
  beforeEach(async () => {
    vi.resetModules();
    process.env.YOUTUBE_API_KEY = 'test';
    const mod = await import('../../server.js');
    app = mod.default || mod;
  });

  test('session flow add and complete song', async () => {
    const sessionRes = await request(app).post('/sessions');
    expect(sessionRes.statusCode).toBe(200);
    const { id, code } = sessionRes.body;
    expect(id).toBeDefined();
    expect(code).toBeDefined();

    const joinRes = await request(app)
      .post(`/sessions/${code}/join`)
      .send({ name: 'Alice' });
    expect(joinRes.statusCode).toBe(200);
    expect(joinRes.body.sessionId).toBe(id);

    const songRes = await request(app)
      .post('/songs')
      .send({ videoId: 'ABCDEFGHIJK', singer: 'Alice' });
    expect(songRes.statusCode).toBe(200);
    const songId = songRes.body.id;

    const queueRes = await request(app).get('/queue');
    expect(queueRes.statusCode).toBe(200);
    expect(queueRes.body.queue.length).toBe(1);
    expect(queueRes.body.queue[0].id).toBe(songId);

    const completeRes = await request(app).post(`/songs/${songId}/complete`);
    expect(completeRes.statusCode).toBe(200);

    const queueEmpty = await request(app).get('/queue');
    expect(queueEmpty.body.queue.length).toBe(0);
  });

  test('fair queue ordering', async () => {
    const sessionRes = await request(app).post('/sessions');
    const { code } = sessionRes.body;

    await request(app).post(`/sessions/${code}/join`).send({ name: 'A' });
    await request(app).post(`/sessions/${code}/join`).send({ name: 'B' });

    await request(app)
      .post('/songs')
      .send({ videoId: 'AAAAAAAAAAA', singer: 'A' });
    await request(app)
      .post('/songs')
      .send({ videoId: 'BBBBBBBBBBB', singer: 'A' });
    await request(app)
      .post('/songs')
      .send({ videoId: 'CCCCCCCCCCC', singer: 'B' });

    const queueRes = await request(app).get('/queue');
    expect(queueRes.statusCode).toBe(200);
    expect(queueRes.body.queue.map((s) => s.videoId)).toEqual([
      'AAAAAAAAAAA',
      'CCCCCCCCCCC',
      'BBBBBBBBBBB',
    ]);
  });

  test('current session endpoint returns QR code', async () => {
    const sessionRes = await request(app).post('/sessions');
    const { code } = sessionRes.body;

    const current = await request(app).get('/sessions/current');
    expect(current.statusCode).toBe(200);
    expect(current.body.code).toBe(code);
    expect(current.body.qrCode).toMatch(/^data:image\/png;base64,/);
  });
});
