import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import { google } from 'googleapis';
import { getFirestore } from './firebase.js';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import QRCode from 'qrcode';
import { parseVideoId } from './parseVideoId.js';
import { getFairQueue } from './fairPlay.js';
import {
  generateRegistration,
  verifyRegistration,
  generateAuth,
  verifyAuth,
} from './kjAuth.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rpID = process.env.RP_ID || 'localhost';
const originBase = process.env.ORIGIN || `http://${rpID}:3000`;
const adminId = process.env.ADMIN_UUID || uuidv4();
process.env.ADMIN_UUID = adminId;

const app = express();
app.use(bodyParser.json());

// Serve static files for the Lit UI first
app.use(express.static(path.join(__dirname, 'public', 'dist')));
// Serve legacy/admin static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/auth/register/options', async (req, res) => {
  const opts = await generateRegistration();
  res.json(opts);
});

app.post('/auth/register/verify', async (req, res) => {
  try {
    console.log('Registration verification request:', JSON.stringify(req.body, null, 2));
    const verified = await verifyRegistration(req.body);
    console.log('Registration verification result:', verified);
    res.json({ verified });
  } catch (err) {
    console.error('Registration verification error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.get('/auth/login/options', async (req, res) => {
  const opts = await generateAuth();
  res.json(opts);
});

app.post('/auth/login/verify', async (req, res) => {
  try {
    const verified = await verifyAuth(req.body);
    res.json({ verified });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
  console.error('Missing YOUTUBE_API_KEY environment variable');
  process.exit(1);
}
const youtube = google.youtube({ version: 'v3', auth: apiKey });
let db;

(async () => {
  db = await getFirestore();

  const port = process.env.PORT || 3000;
  if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`KJ registration link: ${originBase}/admin/${adminId}`);
    });
  }
})();

let queue = [];
let sessions = {};
let currentSession = null;
let singers = {};
let singerStats = {};
let phase2Start = null;
let paused = false;

async function getVideoInfo(videoId) {
  const resp = await youtube.videos.list({ part: 'snippet', id: videoId });
  if (!resp.data.items.length) throw new Error('Video not found');
  const snippet = resp.data.items[0].snippet;
  return {
    videoId,
    title: snippet.title,
    thumbnail: snippet.thumbnails.default.url,
  };
}

function generateRoomCode() {
  const words1 = ['PURPLE', 'GOLD', 'SILVER', 'CRIMSON', 'JADE'];
  const words2 = ['RAIN', 'SUN', 'MOON', 'STAR', 'SONG'];
  const w1 = words1[Math.floor(Math.random() * words1.length)];
  const w2 = words2[Math.floor(Math.random() * words2.length)];
  return `${w1}-${w2}`;
}

function createSession() {
  const id = uuidv4();
  const code = generateRoomCode();
  const session = { id, code };
  sessions[id] = session;
  currentSession = session;
  if (db) db.collection('sessions').doc(id).set(session);
  return session;
}

function joinSession(code, name, deviceId) {
  const session = Object.values(sessions).find((s) => s.code === code);
  if (!session) throw new Error('Invalid room code');
  if (!name) throw new Error('Missing singer name');
  if (deviceId && !uuidValidate(deviceId)) {
    throw new Error('Invalid deviceId format');
  }
  if (!deviceId) deviceId = uuidv4();
  singers[session.id] = singers[session.id] || [];
  let singer = singers[session.id].find((s) => s.deviceId === deviceId);
  if (!singer) {
    singer = { id: uuidv4(), name, deviceId };
    singers[session.id].push(singer);
    if (!singerStats[singer.name]) singerStats[singer.name] = { songsSung: 0 };
  } else {
    if (singer.name !== name) {
      throw new Error('Device already registered with a different name');
    }
    if (!singerStats[singer.name]) singerStats[singer.name] = { songsSung: 0 };
  }
  if (db) {
    db.collection('sessions')
      .doc(session.id)
      .collection('singers')
      .doc(singer.id)
      .set({ name: singer.name, deviceId: singer.deviceId });
  }
  return {
    sessionId: session.id,
    singerId: singer.id,
    deviceId: singer.deviceId,
  };
}

app.post('/sessions', async (req, res) => {
  try {
    const session = createSession();
    const joinLink = `${originBase}/?code=${encodeURIComponent(session.code)}`;
    const qrCode = await QRCode.toDataURL(joinLink);
    res.json({ id: session.id, code: session.code, qrCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/sessions/current', async (req, res) => {
  if (!currentSession) return res.status(404).json({ error: 'No session' });
  const joinLink = `${originBase}/?code=${encodeURIComponent(currentSession.code)}`;
  const qrCode = await QRCode.toDataURL(joinLink);
  res.json({ id: currentSession.id, code: currentSession.code, qrCode });
});

app.post('/sessions/:code/join', (req, res) => {
  const { code } = req.params;
  const { name, deviceId } = req.body;
  try {
    const result = joinSession(code, name, deviceId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

function addSong(videoId, singer) {
  const count = queue.filter((q) => q.singer === singer).length;
  if (count >= 3) {
    throw new Error('Singer has reached song limit');
  }
  if (!singerStats[singer]) singerStats[singer] = { songsSung: 0 };
  const song = { id: uuidv4(), videoId, singer, addedAt: Date.now() };
  queue.push(song);
  if (db) db.collection('songs').doc(song.id).set(song);
  return song;
}

function completeSong(id) {
  const idx = queue.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Song not found');
  const [song] = queue.splice(idx, 1);
  if (!singerStats[song.singer]) singerStats[song.singer] = { songsSung: 0 };
  singerStats[song.singer].songsSung += 1;
  if (db) {
    db.collection('songs')
      .doc(id)
      .update({ completed: true })
      .catch((e) => console.error('Firestore update error:', e));
  }
  return song;
}

function removeSong(id) {
  const idx = queue.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Song not found');
  const [song] = queue.splice(idx, 1);
  if (db) {
    db.collection('songs')
      .doc(id)
      .delete()
      .catch((e) => console.error('Firestore delete error:', e));
  }
  return song;
}

function replaceSong(id, videoId) {
  const song = queue.find((s) => s.id === id);
  if (!song) throw new Error('Song not found');
  song.videoId = videoId;
  if (db) {
    db.collection('songs')
      .doc(id)
      .update({ videoId })
      .catch((e) => console.error('Firestore update error:', e));
  }
  return song;
}

function reorderSongs(order) {
  if (!Array.isArray(order)) throw new Error('order must be an array');
  const map = {};
  queue.forEach((s) => {
    map[s.id] = s;
  });
  const newQueue = [];
  order.forEach((id) => {
    if (map[id]) {
      newQueue.push(map[id]);
      delete map[id];
    }
  });
  const remaining = queue.filter((s) => map[s.id]);
  queue = newQueue.concat(remaining);
}

function skipSong(id) {
  const idx = queue.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Song not found');
  const [song] = queue.splice(idx, 1);
  if (db) {
    db.collection('songs')
      .doc(id)
      .update({ skipped: true })
      .catch((e) => console.error('Firestore update error:', e));
  }
  return song;
}

app.get('/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing q' });
  try {
    const r = await youtube.search.list({
      part: 'snippet',
      q: q + ' karaoke',
      maxResults: 5,
      type: 'video',
    });
    res.json(
      r.data.items.map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/preview', async (req, res) => {
  const { url, videoId } = req.query;
  const id = parseVideoId(videoId || url);
  if (!id)
    return res.status(400).json({ error: 'Invalid or missing video ID' });
  try {
    const info = await getVideoInfo(id);
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/songs', async (req, res) => {
  const { url, videoId, singer } = req.body;
  const id = parseVideoId(videoId || url);
  if (!id || !singer)
    return res.status(400).json({ error: 'Missing videoId or singer' });
  try {
    const song = addSong(id, singer);
    res.json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/songs/:id/error', (req, res) => {
  const { id } = req.params;
  const { error } = req.body;
  const song = queue.find((s) => s.id === id);
  if (!song) return res.status(404).json({ error: 'Song not found' });
  song.error = error || 'unknown';
  if (db) {
    db.collection('songs')
      .doc(id)
      .update({ error: song.error })
      .catch((e) => console.error('Firestore update error:', e));
  }
  res.json({ success: true });
});

app.post('/songs/:id/complete', (req, res) => {
  const { id } = req.params;
  try {
    completeSong(id);
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.delete('/songs/:id', (req, res) => {
  const { id } = req.params;
  try {
    removeSong(id);
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.put('/songs/:id', (req, res) => {
  const { id } = req.params;
  const vid = parseVideoId(req.body.videoId || req.body.url);
  if (!vid)
    return res.status(400).json({ error: 'Invalid or missing videoId' });
  try {
    replaceSong(id, vid);
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.post('/songs/reorder', (req, res) => {
  const { order } = req.body;
  try {
    reorderSongs(order);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/songs/:id/skip', (req, res) => {
  const { id } = req.params;
  try {
    skipSong(id);
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.post('/sessions/pause', (req, res) => {
  paused = !!req.body.paused;
  res.json({ paused });
});

app.post('/phase2', (req, res) => {
  const { startTime } = req.body;
  phase2Start = startTime ? new Date(startTime).getTime() : Date.now();
  res.json({ phase2Start });
});

function inPhase2() {
  const allSung =
    Object.keys(singerStats).length > 0 &&
    Object.values(singerStats).every((s) => s.songsSung > 0);
  if (allSung) return true;
  if (phase2Start && Date.now() >= phase2Start) return true;
  return false;
}

app.get('/queue', (req, res) => {
  const ordered = getFairQueue(queue, singerStats, inPhase2());
  res.json({ paused, queue: ordered });
});

// Admin UI routes served by the Lit app
app.get('/admin/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

// Serve the Lit app from the Vite build output for all non-API, non-admin routes
app.get(
  /^\/(?!api|auth|sessions|songs|search|preview|queue|phase2|public|dist|assets|admin).*/,
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
  },
);

export default app;
