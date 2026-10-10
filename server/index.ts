// Server produksi: melayani website (dist/), CRM owner, dan API.
// Dipakai di hosting Node.js (mis. cPanel "Setup Node.js App" DomaiNesia).
// Build: npm run build  ->  jalankan: node server.cjs
import path from 'node:path';
import { existsSync } from 'node:fs';
import { config as loadEnv } from 'dotenv';
import express from 'express';

import { handleApiRequest } from '../src/server/apiHandler.ts';
import { configureCrm } from '../src/server/crm/db.ts';
import { handleCrmRequest } from '../src/server/crm/handler.ts';

const root = process.cwd();
loadEnv({ path: [path.join(root, '.env.local'), path.join(root, '.env')], quiet: true });
configureCrm(process.env);

const dist = path.join(root, 'dist');
if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('Folder dist/ belum ada. Jalankan "npm run build" dulu.');
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CRM (/crm, /api/crm/*, /api/public/*, /media/*) lalu API Gemini (/api/*).
app.use(async (req, res, next) => {
  try {
    if (await handleCrmRequest(req, res)) return;
    if (req.url.startsWith('/api/') && (await handleApiRequest(req, res))) return;
    next();
  } catch (e) {
    next(e);
  }
});

app.use(
  express.static(dist, {
    index: 'index.html',
    setHeaders(res, file) {
      // File ber-hash dari Vite boleh di-cache lama; HTML selalu segar.
      if (file.includes(`${path.sep}assets${path.sep}`)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      else if (file.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    },
  }),
);

app.use((_req, res) => {
  res.status(404).sendFile(path.join(dist, 'index.html'));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Ayam Geprek Al-Fariz jalan di port ${port} (CRM: /crm)`);
});
