const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const { getFirestore } = require('./firebase');
const { v4: uuidv4 } = require('uuid');
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

app.post('/sessions', async (req, res) => {
  try {
    const session = createSession();
    const qrCode = await QRCode.toDataURL(session.code);
    res.json({ id: session.id, code: session.code, qrCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

app.post('/songs', async (req, res) => {
  const { url, videoId, singer } = req.body;
  const id = videoId || (url && url.match(/v=([\w-]+)/)?.[1]);
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
