const { spawn } = require('child_process');
const open = require('open');

const server = spawn('node', ['server.js'], { stdio: ['inherit', 'pipe', 'inherit'] });

server.stdout.on('data', (data) => {
  const msg = data.toString();
  process.stdout.write(msg);
  if (msg.includes('Server running on port')) {
    const portMatch = msg.match(/port (\d+)/);
    const port = portMatch ? portMatch[1] : '3000';
    open(`http://localhost:${port}/`);
  }
});

server.on('close', (code) => process.exit(code));

