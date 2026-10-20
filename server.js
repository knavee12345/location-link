const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3001;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'locations.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

function readLocations() {
  try {
    ensureDataFile();
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
  } catch (error) {
    console.error('Failed to read data:', error);
    return [];
  }
}

function writeLocations(entries) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8'
    };

    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.url === '/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.url === '/api/location' && req.method === 'GET') {
    sendJson(res, 200, readLocations());
    return;
  }

  if (req.url === '/api/location' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (typeof payload.latitude !== 'number' || typeof payload.longitude !== 'number') {
          sendJson(res, 400, { error: 'Latitude and longitude are required.' });
          return;
        }

        const entry = {
          id: Date.now(),
          latitude: payload.latitude,
          longitude: payload.longitude,
          accuracy: Number(payload.accuracy) || 0,
          timestamp: payload.timestamp || new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        const entries = readLocations();
        entries.unshift(entry);
        writeLocations(entries.slice(0, 50));
        sendJson(res, 200, { success: true, entry });
      } catch (error) {
        sendJson(res, 400, { error: 'Invalid JSON payload.' });
      }
    });
    return;
  }

  const routeMap = {
    '/': path.join(ROOT, 'share_my_location.html'),
    '/share_my_location.html': path.join(ROOT, 'share_my_location.html'),
    '/read_locations.html': path.join(ROOT, 'read_locations.html')
  };

  const filePath = routeMap[url.pathname];
  if (filePath) {
    sendFile(res, filePath);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Location tracker running at http://localhost:${PORT}`);
});
