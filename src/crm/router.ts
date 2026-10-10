// Router sederhana berbasis hash: #/pesanan?order=...&view=daftar
import { useSyncExternalStore } from 'react';

function read() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  return { path: path || '/', query: new URLSearchParams(query), raw };
}

let snapshot = typeof window !== 'undefined' ? read() : { path: '/', query: new URLSearchParams(), raw: '/' };

function subscribe(cb: () => void) {
  const on = () => {
    snapshot = read();
    cb();
  };
  window.addEventListener('hashchange', on);
  return () => window.removeEventListener('hashchange', on);
}

export function useRoute() {
  return useSyncExternalStore(subscribe, () => snapshot);
}

export function navigate(path: string, query?: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(query ?? {})) if (v) q.set(k, v);
  const s = q.toString();
  window.location.hash = `${path}${s ? `?${s}` : ''}`;
}

// Ubah sebagian query tanpa ganti halaman.
export function setQuery(patch: Record<string, string | undefined>) {
  const { path, query } = read();
  const next: Record<string, string | undefined> = Object.fromEntries(query.entries());
  Object.assign(next, patch);
  navigate(path, next);
}
