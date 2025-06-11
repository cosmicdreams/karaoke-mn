import { spawn } from 'child_process';
import { randomUUID } from 'crypto';

export function startServer() {
  const adminId = randomUUID();
  const server = spawn('node', ['server.js'], {
    env: { ...process.env, YOUTUBE_API_KEY: 'test', ADMIN_UUID: adminId },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const ready = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server start timeout')), 10000);
    server.stdout.on('data', (data) => {
      const msg = data.toString();
      const match = msg.match(/KJ registration link: (.*)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1].trim());
      }
    });
  });
  return { server, ready };
}

