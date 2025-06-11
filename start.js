import { spawn } from 'child_process';
import net from 'net';
import { v4 as uuidv4 } from 'uuid';

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

async function openBrowser(port = 3000, adminId) {
  const open = (await import('open')).default;
  await open(`http://localhost:${port}/admin/${adminId}`);
}

async function startApp() {
  const port = 3000;
  const adminId = uuidv4();
  const isPortInUse = await checkPortInUse(port);

  if (isPortInUse) {
    console.log(`Server already running on port ${port}`);
    console.log('Opening browser to existing instance...');
    await openBrowser(port, adminId);
    return;
  }

  const server = spawn('node', ['backend/server.js'], {
    stdio: ['inherit', 'pipe', 'inherit'],
    env: { ...process.env, ADMIN_UUID: adminId },
  });

  server.stdout.on('data', async (data) => {
    const msg = data.toString();
    process.stdout.write(msg);
    if (msg.includes('Server running on port')) {
      const portMatch = msg.match(/port (\d+)/);
      const detectedPort = portMatch ? portMatch[1] : '3000';
      const link = `http://localhost:${detectedPort}/admin/${adminId}`;
      //console.log(`KJ registration link: ${link}`);
      await openBrowser(detectedPort, adminId);
    }
  });

  server.on('close', (code) => process.exit(code));
}

startApp().catch(console.error);

