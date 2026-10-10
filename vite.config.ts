import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { handleApiRequest } from './src/server/apiHandler.ts';
import { configureCrm } from './src/server/crm/db.ts';
import { handleCrmRequest } from './src/server/crm/handler.ts';

export default defineConfig(({ mode }) => {
  // MySQL + kata sandi owner dibaca dari .env / .env.local (server saja).
  configureCrm({ ...process.env, ...loadEnv(mode, process.cwd(), '') });
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // CRM owner (MySQL lokal): /crm, /api/crm/*, /api/public/*, /media/*
            if (await handleCrmRequest(req, res)) return;
            if (req.url && req.url.startsWith('/api/')) {
              const handled = await handleApiRequest(req, res);
              if (handled) return;
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // Pindai kedua halaman sejak awal supaya dependensi CRM tidak dioptimasi ulang di tengah jalan.
    optimizeDeps: {
      entries: ['index.html', 'crm.html'],
      include: ['@tanstack/react-query', 'sonner'],
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          crm: path.resolve(__dirname, 'crm.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
