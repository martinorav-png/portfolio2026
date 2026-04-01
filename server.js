/**
 * Serves the Vite production build from `dist/`.
 * The dev `index.html` loads `/src/main.tsx`, which only works with `npm run dev` (Vite).
 * Using this server against the repo root without building → empty #root → white screen.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
};

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const trimmed = decoded.replace(/^\/+/, '');
  if (!trimmed || trimmed.includes('..')) return null;
  const rel = path.normalize(trimmed);
  if (rel.startsWith('..')) return null;
  const full = path.join(DIST, rel);
  const distNorm = path.resolve(DIST);
  const fullNorm = path.resolve(full);
  if (!fullNorm.startsWith(distNorm + path.sep) && fullNorm !== distNorm) return null;
  return fullNorm;
}

if (!fs.existsSync(DIST)) {
  console.error(
    '\n  No `dist` folder. Run `npm run build` first, then `npm start`.\n' +
      '  For local development with hot reload, use `npm run dev`.\n'
  );
  process.exit(1);
}

http
  .createServer((req, res) => {
    const raw = req.url === '/' ? '/index.html' : req.url || '/index.html';
    const decodedPath = decodeURIComponent(raw.split('?')[0]);
    const filePath = safeResolve(raw);

    const sendFile = (fp) => {
      const ext = path.extname(fp).toLowerCase();
      fs.readFile(fp, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      });
    };

    if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return sendFile(filePath);
    }

    const ext = path.extname(decodedPath);
    const indexPath = path.join(DIST, 'index.html');
    if (!ext && fs.existsSync(indexPath)) {
      return sendFile(indexPath);
    }

    res.writeHead(404);
    res.end('Not found');
  })
  .listen(PORT, () => {
    console.log(`Serving dist/ at http://localhost:${PORT}`);
    console.log('(Use npm run dev for development.)');
  });
