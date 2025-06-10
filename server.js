const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const { getFirestore } = require('./firebase');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const QRCode = require('qrcode');

const app = express();
app.use(bodyParser.json());

const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
  console.error('Missing YOUTUBE_API_KEY environment variable');
  process.exit(1);
}
const youtube = google.youtube({ version: 'v3', auth: apiKey });
const db = getFirestore();
let queue = [];
let sessions = {};
let singers = {};

function parseVideoId(input) {
  if (!input) return null;
  if (/^[\w-]{11}$/.test(input)) return input;
  const vParam = input.match(/[?&]v=([\w-]{11})/);
  if (vParam) return vParam[1];
  const short = input.match(/youtu\.be\/([\w-]{11})/);
  if (short) return short[1];
  const embed = input.match(/embed\/([\w-]{11})/);
  if (embed) return embed[1];
  return null;
}

async function getVideoInfo(videoId) {
  const resp = await youtube.videos.list({ part: 'snippet', id: videoId });
  if (!resp.data.items.length) throw new Error('Video not found');
  const snippet = resp.data.items[0].snippet;
  return {
    videoId,
    title: snippet.title,
    thumbnail: snippet.thumbnails.default.url
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
  if (db) db.collection('sessions').doc(id).set(session);
  return session;
}

function joinSession(code, name, deviceId) {
  const session = Object.values(sessions).find(s => s.code === code);
  if (!session) throw new Error('Invalid room code');
  if (!name) throw new Error('Missing singer name');
  if (deviceId && !uuidValidate(deviceId)) {
    throw new Error('Invalid deviceId format');
  }
  if (!deviceId) deviceId = uuidv4();
  singers[session.id] = singers[session.id] || [];
  let singer = singers[session.id].find(s => s.deviceId === deviceId);
  if (!singer) {
    singer = { id: uuidv4(), name, deviceId };
    singers[session.id].push(singer);
  } else {
    if (singer.name !== name) {
      throw new Error('Device already registered with a different name');
    }
  }
  if (db) {
    db.collection('sessions')
      .doc(session.id)
      .collection('singers')
      .doc(singer.id)
      .set({ name: singer.name, deviceId: singer.deviceId });
  }
  return { sessionId: session.id, singerId: singer.id, deviceId: singer.deviceId };
}

app.post('/sessions', async (req, res) => {
  try {
    const session = createSession();
    const qrCode = await QRCode.toDataURL(session.code);
    res.json({ id: session.id, code: session.code, qrCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  const count = queue.filter(q => q.singer === singer).length;
  if (count >= 3) {
    throw new Error('Singer has reached song limit');
  }
  const song = { id: uuidv4(), videoId, singer };
  queue.push(song);
  if (db) db.collection('songs').doc(song.id).set(song);
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
      type: 'video'
    });
    res.json(r.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/preview', async (req, res) => {
  const { url, videoId } = req.query;
  const id = parseVideoId(videoId || url);
  if (!id) return res.status(400).json({ error: 'Invalid or missing video ID' });
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
  if (!id || !singer) return res.status(400).json({ error: 'Missing videoId or singer' });
  try {
    const song = addSong(id, singer);
    res.json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/queue', (req, res) => {
  res.json(queue);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
