import { spawn, spawnSync } from 'child_process';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';

export function startServer() {
  if (!existsSync('public/dist/index.html')) {
    console.log('Building frontend for E2E tests...');
    spawnSync('npm', ['run', 'build'], { stdio: 'inherit' });
  }
  const adminId = randomUUID();
  const server = spawn('node', ['server.js'], {
    env: { ...process.env, YOUTUBE_API_KEY: 'test', ADMIN_UUID: adminId },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  
  // Log server output for debugging
  server.stdout.on('data', (data) => {
    console.log('Server stdout:', data.toString());
  });
  
  server.stderr.on('data', (data) => {
    console.log('Server stderr:', data.toString());
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

