// Zero-dependency static file server for the built Astro site (dist/).
// PM2 runs this file; it listens on PORT / HOSTNAME from ecosystem.config.cjs.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOSTNAME || '0.0.0.0';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.pdf': 'application/pdf', '.webmanifest': 'application/manifest+json',
};

function cacheFor(urlPath) {
  if (urlPath.startsWith('/_astro/')) return 'public, max-age=31536000, immutable'; // hashed file names
  if (urlPath.endsWith('.html') || urlPath.endsWith('/')) return 'public, max-age=0, must-revalidate';
  return 'public, max-age=604800'; // images, fonts, etc: 7 days
}

function send(req, res, status, file, urlPath) {
  fs.stat(file, (err, st) => {
    if (err) return res.writeHead(500).end('Server error');
    const headers = {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Last-Modified': st.mtime.toUTCString(),
      'Cache-Control': status === 200 ? cacheFor(urlPath) : 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
    if (status === 200 && req.headers['if-modified-since'] && new Date(req.headers['if-modified-since']) >= new Date(st.mtime.toUTCString())) {
      return res.writeHead(304, headers).end();
    }
    res.writeHead(status, headers);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

function notFound(req, res) {
  const page = path.join(ROOT, '404.html');
  if (fs.existsSync(page)) return send(req, res, 404, page, '/404.html');
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.writeHead(405, { Allow: 'GET, HEAD' }).end();
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { return res.writeHead(400).end(); }
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT)) return res.writeHead(403).end(); // block ../ path traversal

  fs.stat(file, (err, st) => {
    if (!err && st.isFile()) return send(req, res, 200, file, urlPath);
    if (!err && st.isDirectory()) {
      if (!urlPath.endsWith('/')) { // site uses trailing slashes: /about-us -> /about-us/
        const q = req.url.indexOf('?');
        return res.writeHead(301, { Location: urlPath + '/' + (q >= 0 ? req.url.slice(q) : '') }).end();
      }
      const index = path.join(file, 'index.html');
      return fs.stat(index, (e2, s2) => (!e2 && s2.isFile() ? send(req, res, 200, index, urlPath) : notFound(req, res)));
    }
    notFound(req, res);
  });
});

server.listen(PORT, HOST, () => console.log(`NeoVentraX serving ${ROOT} on http://${HOST}:${PORT}`));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => server.close(() => process.exit(0)));
