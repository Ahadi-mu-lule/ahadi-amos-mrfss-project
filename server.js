const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function injectAuthGuard(html) {
  if (!html.includes('</head>')) {
    return html;
  }

  return html.replace(
    '</head>',
    `<script src="/auth.js"></script>
     <script>
       document.addEventListener('DOMContentLoaded', function () {
         if (window.BakyengaAuth && typeof window.BakyengaAuth.requireAuth === 'function') {
           window.BakyengaAuth.requireAuth();
         }
       });
     </script>
     </head>`
  );
}

function injectLogoutButton(html) {
  if (!html.includes('</body>')) {
    return html;
  }

  return html.replace(
    '</body>',
    `<div style="position: fixed; right: 18px; bottom: 18px; z-index: 1000;">
       <button id="logoutBtn" style="padding: 10px 16px; border-radius: 999px; border: 1px solid rgba(148,163,184,0.25); background: rgba(15,23,42,0.92); color: #fff; cursor: pointer; font-weight: 500;">
         Logout
       </button>
     </div>
     <script>
       document.addEventListener('DOMContentLoaded', function () {
         const btn = document.getElementById('logoutBtn');
         if (btn) {
           btn.addEventListener('click', function () {
             localStorage.removeItem('bakyenga_saas_session');
             localStorage.removeItem('bakyenga_current_user_id');
             window.location.href = '/login.html';
           });
         }
       });
     </script>
     </body>`
  );
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  if (reqPath === '/login') {
    reqPath = '/login.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (ext === '.html' && filePath.endsWith(path.join(PUBLIC_DIR, 'index.html'))) {
      fs.readFile(filePath, 'utf8', (readErr, html) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
          return;
        }

        const guardedHtml = injectAuthGuard(injectLogoutButton(html));

        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache'
        });
        res.end(guardedHtml);
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Bakyenga Traders POS is live at http://0.0.0.0:${PORT}`);
  console.log(`Login page: http://0.0.0.0:${PORT}/login.html`);
});