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

describe('singer profiles', () => {
  test('completing a song records history', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    const joinRes = await request(app)
      .post(`/sessions/${code}/join`)
      .send({ name: 'Alice' });
    const deviceId = joinRes.body.deviceId;
    const addRes = await request(app)
      .post('/songs')
      .send({ videoId: 'VIDPROF1234', singer: 'Alice' });
    const songId = addRes.body.id;
    await request(app).post(`/songs/${songId}/complete`);
    const profile = await request(app).get(`/singers/${deviceId}`);
    expect(profile.body.history.length).toBe(1);
    expect(profile.body.history[0].videoId).toBe('VIDPROF1234');
  });

  test('favorites can be saved and retrieved', async () => {
    const session = await request(app).post('/sessions');
    const { code } = session.body;
    const joinRes = await request(app)
      .post(`/sessions/${code}/join`)
      .send({ name: 'Bob' });
    const deviceId = joinRes.body.deviceId;

    const favorites = [{ videoId: 'VIDFAV1', title: 'Fav Song' }];
    await request(app)
      .put(`/singers/${deviceId}`)
      .send({ favorites });

    const profile = await request(app).get(`/singers/${deviceId}`);
    expect(profile.body.favorites).toEqual(favorites);
  });
});
