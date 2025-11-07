import { google } from 'googleapis';

const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
  console.error('Missing YOUTUBE_API_KEY environment variable');
  process.exit(1);
}
const youtube = google.youtube({ version: 'v3', auth: apiKey });

export async function getVideoInfo(videoId) {
  const resp = await youtube.videos.list({
    part: 'snippet,status',
    id: videoId,
  });
  if (!resp.data.items.length) throw new Error('Video not found');
  const item = resp.data.items[0];
  if (item.status && item.status.embeddable === false) {
    throw new Error('Video not embeddable');
  }
  const snippet = item.snippet;
  return {
    videoId,
    title: snippet.title,
    artist: snippet.channelTitle,
    thumbnail: snippet.thumbnails.default.url,
  };
}
