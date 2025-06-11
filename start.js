import { spawn } from 'child_process';
import net from 'net';

async function checkPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(false));
      server.close();
    });
    server.on('error', () => resolve(true));
  });
}

async function openBrowser(port = 3000) {
  const open = (await import('open')).default;
  await open(`http://localhost:${port}/`);
}

async function startApp() {
  const port = 3000;
  const isPortInUse = await checkPortInUse(port);
  
  if (isPortInUse) {
    console.log(`Server already running on port ${port}`);
    console.log('Opening browser to existing instance...');
    await openBrowser(port);
    return;
  }

  const server = spawn('node', ['server.js'], { stdio: ['inherit', 'pipe', 'inherit'] });

  server.stdout.on('data', async (data) => {
    const msg = data.toString();
    process.stdout.write(msg);
    if (msg.includes('Server running on port')) {
      const portMatch = msg.match(/port (\d+)/);
      const detectedPort = portMatch ? portMatch[1] : '3000';
      await openBrowser(detectedPort);
    }
  });

  server.on('close', (code) => process.exit(code));
}

startApp().catch(console.error);

