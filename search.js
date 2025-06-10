require('dotenv').config();
const {google} = require('googleapis');
const query = process.argv.slice(2).join(' ');

if (!query) {
  console.error('Usage: node search.js <search query>');
  process.exit(1);
}

const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
  console.error('Missing YOUTUBE_API_KEY environment variable');
  process.exit(1);
}

const youtube = google.youtube({version: 'v3', auth: apiKey});

async function run() {
  try {
    const res = await youtube.search.list({
      part: 'snippet',
      q: query + ' karaoke',
      maxResults: 5,
      type: 'video'
    });
    res.data.items.forEach(item => {
      console.log(`${item.id.videoId} - ${item.snippet.title}`);
    });
  } catch (err) {
    console.error('Error during search:', err.message);
    process.exit(1);
  }
}

run();
