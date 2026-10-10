// HTTP API untuk CRM owner + API publik untuk website pelanggan.
// Dipasang sebagai middleware di server dev Vite (lihat vite.config.ts).
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { z } from 'zod';

import { crmConfig } from './db.ts';
import * as store from './store.ts';
import { CATEGORIES, ORDER_STATUSES, PAYMENT_STATUSES } from '../../crm/types.ts';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'produk');
const COOKIE = 'af_owner';
const MAX_AGE = 60 * 60 * 24 * 7;

// ---------- helpers ----------
function send(res: ServerResponse, status: number, data: unknown, headers: Record<string, string> = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(data));
  return true;
}

function readBody(req: IncomingMessage, limit: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const buf = await readBody(req, 64 * 1024);
  return buf.length ? JSON.parse(buf.toString('utf8')) : {};
}

function cookies(req: IncomingMessage): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function origin(req: IncomingMessage) {
  // Di hosting, HTTPS dilayani proxy di depan Node; ikuti header-nya.
  const proto = String(req.headers['x-forwarded-proto'] ?? 'http').split(',')[0].trim();
  return `${proto === 'https' ? 'https' : 'http'}://${req.headers.host ?? 'localhost:3000'}`;
}

function clientIp(req: IncomingMessage) {
  return String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

// ---------- auth (cookie bertanda tangan HMAC) ----------
function signingKey() {
  const c = crmConfig();
  if (!c.OWNER_PASSWORD || !c.SESSION_SECRET) return null;
  return `${c.SESSION_SECRET}:${c.OWNER_PASSWORD}`;
}
const hmac = (key: string, msg: string) => createHmac('sha256', key).update(msg).digest('base64url');
function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function isOwner(req: IncomingMessage) {
  const key = signingKey();
  const raw = cookies(req)[COOKIE];
  if (!key || !raw) return false;
  const [exp, nonce, sig] = raw.split('.');
  if (!exp || !nonce || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, hmac(key, `${exp}.${nonce}`));
}

function sessionCookie(key: string, secure: boolean) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const body = `${exp}.${randomBytes(12).toString('base64url')}`;
  return `${COOKIE}=${body}.${hmac(key, body)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}${secure ? '; Secure' : ''}`;
}

// ---------- schemas ----------
const categoryValues = CATEGORIES.map((c) => c.value) as [string, ...string[]];
const statusValues = ORDER_STATUSES.map((c) => c.value) as [string, ...string[]];
const paymentValues = PAYMENT_STATUSES.map((c) => c.value) as [string, ...string[]];

const productSchema = z.object({
  id: z.string().max(80).optional(),
  name: z.string().trim().min(2).max(80),
  category: z.enum(categoryValues),
  price: z.number().int().min(0).max(10_000_000),
  description: z.string().trim().max(400),
  image_url: z.string().trim().max(500).refine((v) => v === '' || v.startsWith('/') || v.startsWith('https://')),
  badge: z.string().trim().max(20),
  spice_supported: z.number().int().min(0).max(1),
  is_active: z.number().int().min(0).max(1),
  sort_order: z.number().int().min(0).max(9999),
});

const lineSchema = z.object({
  productId: z.string().max(80),
  qty: z.number().int().min(1).max(500),
  options: z.string().max(200).optional(),
});

const publicOrderSchema = z.object({
  customerName: z.string().trim().min(1).max(60),
  customerPhone: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(300).optional(),
  paymentMethod: z.string().trim().max(60).optional(),
  paidClaim: z.boolean().optional(),
  items: z.array(lineSchema).min(1).max(20),
});

const manualOrderSchema = z.object({
  customerName: z.string().trim().min(1).max(60),
  customerPhone: z.string().trim().max(20),
  notes: z.string().trim().max(300),
  paymentMethod: z.string().trim().max(60),
  paid: z.boolean(),
  items: z.array(lineSchema).min(1).max(30),
});

const settingsSchema = z.object({
  tax_percent: z.number().min(0).max(50),
  accepting_orders: z.boolean(),
  whatsapp: z.string().trim().regex(/^\d{8,15}$/),
  store_name: z.string().trim().min(2).max(80),
});

const IMAGE_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

// ---------- router ----------
export async function handleCrmRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const p = url.pathname;
  const m = req.method ?? 'GET';

  // Alamat pendek untuk owner.
  if (p === '/crm' || p === '/crm/') {
    res.statusCode = 302;
    res.setHeader('Location', '/crm.html');
    res.end();
    return true;
  }

  // Foto produk yang diunggah owner.
  if (p.startsWith('/media/produk/') && m === 'GET') {
    const name = p.slice('/media/produk/'.length);
    if (!/^[0-9a-f-]+\.(jpg|png|webp)$/.test(name)) return send(res, 404, { ok: false });
    const file = path.join(UPLOAD_DIR, name);
    if (!existsSync(file)) return send(res, 404, { ok: false });
    res.setHeader('Content-Type', name.endsWith('png') ? 'image/png' : name.endsWith('webp') ? 'image/webp' : 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    createReadStream(file).pipe(res);
    return true;
  }

  if (!p.startsWith('/api/public/') && !p.startsWith('/api/crm/')) return false;

  try {
    // ===== API publik (website pelanggan) =====
    if (p === '/api/public/menu' && m === 'GET') {
      const [products, settings] = await Promise.all([store.listProducts(true), store.getSettings()]);
      return send(res, 200, {
        accepting_orders: settings.accepting_orders,
        tax_percent: settings.tax_percent,
        whatsapp: settings.whatsapp,
        products: products.map((x) => ({
          id: x.id,
          name: x.name,
          category: x.category,
          price: x.price,
          description: x.description,
          badge: x.badge,
          spice_supported: x.spice_supported === 1,
          image_url: x.image_url,
        })),
      }, { 'Cache-Control': 'no-store' });
    }

    if (p === '/api/public/orders' && m === 'POST') {
      if (!store.rateLimit(`order:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
        return send(res, 429, { ok: false, message: 'Terlalu banyak pesanan, coba lagi sebentar.' });
      }
      const parsed = publicOrderSchema.safeParse(await readJson(req));
      if (!parsed.success) return send(res, 400, { ok: false, message: 'Data pesanan tidak lengkap.' });
      const settings = await store.getSettings();
      if (!settings.accepting_orders) return send(res, 409, { ok: false, message: 'Maaf, warung sedang tutup.' });
      const d = parsed.data;
      try {
        const r = await store.createOrder({
          customerName: d.customerName,
          customerPhone: d.customerPhone,
          notes: d.notes,
          paymentMethod: d.paymentMethod,
          // Pembayaran di website hanya simulasi: owner yang memverifikasi.
          paymentStatus: d.paidClaim ? 'menunggu_verifikasi' : 'belum_bayar',
          source: 'website',
          items: d.items,
        });
        return send(res, 201, { ok: true, ...r, trackUrl: `${origin(req)}/crm.html#/lacak/${r.code}` });
      } catch (e) {
        if (e instanceof store.OrderError) return send(res, 400, { ok: false, message: e.message });
        throw e;
      }
    }

    const track = p.match(/^\/api\/public\/track\/([A-Za-z0-9-]{4,20})$/);
    if (track && m === 'GET') {
      const found = await store.getOrder({ code: track[1].toUpperCase() });
      if (!found) return send(res, 404, { ok: false });
      const { order, items, events } = found;
      return send(res, 200, {
        ok: true,
        code: order.code,
        customer_name: order.customer_name.split(' ')[0],
        status: order.status,
        payment_status: order.payment_status,
        total: order.total,
        created_at: order.created_at,
        items: items.map((i) => ({ name: i.name, qty: i.qty, options: i.options })),
        events: events.filter((e) => e.kind === 'status').map((e) => ({ value: e.value, created_at: e.created_at })),
      });
    }

    if (p.startsWith('/api/public/')) return send(res, 404, { ok: false });

    // ===== API owner =====
    if (p === '/api/crm/session' && m === 'GET') return send(res, 200, { owner: isOwner(req) });

    if (p === '/api/crm/login' && m === 'POST') {
      if (!store.rateLimit(`login:${clientIp(req)}`, 6, 15 * 60 * 1000)) {
        return send(res, 429, { ok: false, message: 'Terlalu banyak percobaan. Coba lagi 15 menit lagi.' });
      }
      const body = z.object({ password: z.string().min(1).max(200) }).safeParse(await readJson(req));
      const key = signingKey();
      if (!key) return send(res, 500, { ok: false, message: 'OWNER_PASSWORD belum diatur di file .env.local' });
      if (!body.success || !safeEqual(hmac(key, body.data.password), hmac(key, crmConfig().OWNER_PASSWORD))) {
        return send(res, 401, { ok: false, message: 'Kata sandi salah.' });
      }
      return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(key, origin(req).startsWith('https')) });
    }

    if (p === '/api/crm/logout' && m === 'POST') {
      return send(res, 200, { ok: true }, { 'Set-Cookie': `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0` });
    }

    if (!isOwner(req)) return send(res, 401, { ok: false, message: 'UNAUTHORIZED' });

    if (p === '/api/crm/dashboard' && m === 'GET') return send(res, 200, await store.dashboard());

    if (p === '/api/crm/products' && m === 'GET') return send(res, 200, await store.listProducts());
    if (p === '/api/crm/products' && m === 'POST') {
      const parsed = productSchema.safeParse(await readJson(req));
      if (!parsed.success) return send(res, 400, { ok: false, message: 'Isian menu tidak valid.' });
      return send(res, 200, { ok: true, id: await store.upsertProduct(parsed.data as store.ProductInput) });
    }
    if (p === '/api/crm/products/toggle' && m === 'POST') {
      const d = z.object({ id: z.string().max(80), active: z.boolean() }).parse(await readJson(req));
      await store.setProductActive(d.id, d.active);
      return send(res, 200, { ok: true });
    }
    if (p === '/api/crm/products/delete' && m === 'POST') {
      const d = z.object({ id: z.string().max(80) }).parse(await readJson(req));
      await store.deleteProduct(d.id);
      return send(res, 200, { ok: true });
    }

    if (p === '/api/crm/upload' && m === 'POST') {
      const ext = IMAGE_TYPES[(req.headers['content-type'] ?? '').split(';')[0]];
      if (!ext) return send(res, 400, { ok: false, message: 'Format harus JPG, PNG, atau WEBP.' });
      let buf: Buffer;
      try {
        buf = await readBody(req, 4 * 1024 * 1024);
      } catch {
        return send(res, 400, { ok: false, message: 'Ukuran foto maksimal 4 MB.' });
      }
      mkdirSync(UPLOAD_DIR, { recursive: true });
      const name = `${randomUUID()}.${ext}`;
      writeFileSync(path.join(UPLOAD_DIR, name), buf);
      return send(res, 200, { ok: true, url: `/media/produk/${name}` });
    }

    if (p === '/api/crm/orders' && m === 'GET') {
      return send(res, 200, await store.listOrders({
        status: url.searchParams.get('status')?.slice(0, 20) || undefined,
        q: url.searchParams.get('q')?.slice(0, 60) || undefined,
      }));
    }
    if (p === '/api/crm/orders' && m === 'POST') {
      const parsed = manualOrderSchema.safeParse(await readJson(req));
      if (!parsed.success) return send(res, 400, { ok: false, message: 'Isian pesanan belum lengkap.' });
      const d = parsed.data;
      try {
        const r = await store.createOrder({
          customerName: d.customerName,
          customerPhone: d.customerPhone,
          notes: d.notes,
          paymentMethod: d.paymentMethod,
          paymentStatus: d.paid ? 'lunas' : 'belum_bayar',
          source: 'manual',
          items: d.items,
        });
        return send(res, 201, { ok: true, ...r });
      } catch (e) {
        if (e instanceof store.OrderError) return send(res, 400, { ok: false, message: e.message });
        throw e;
      }
    }

    const orderPath = p.match(/^\/api\/crm\/orders\/([0-9a-f-]{36})(\/status|\/payment)?$/);
    if (orderPath) {
      const [, id, action] = orderPath;
      if (!action && m === 'GET') return send(res, 200, await store.getOrder({ id }));
      if (action === '/status' && m === 'POST') {
        const d = z.object({ status: z.enum(statusValues) }).parse(await readJson(req));
        await store.updateOrderField(id, 'status', d.status);
        return send(res, 200, { ok: true });
      }
      if (action === '/payment' && m === 'POST') {
        const d = z.object({ payment: z.enum(paymentValues) }).parse(await readJson(req));
        await store.updateOrderField(id, 'payment', d.payment);
        return send(res, 200, { ok: true });
      }
    }

    if (p === '/api/crm/settings' && m === 'GET') return send(res, 200, await store.getSettings());
    if (p === '/api/crm/settings' && m === 'POST') {
      const parsed = settingsSchema.safeParse(await readJson(req));
      if (!parsed.success) return send(res, 400, { ok: false, message: 'Nomor WhatsApp hanya angka, contoh 628123456789' });
      await store.saveSettings(parsed.data);
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { ok: false, message: 'Not found' });
  } catch (e) {
    if (e instanceof z.ZodError || e instanceof SyntaxError) return send(res, 400, { ok: false, message: 'Data tidak valid.' });
    const code = (e as { code?: string }).code;
    if (code === 'ECONNREFUSED' || code === 'ER_ACCESS_DENIED_ERROR') {
      return send(res, 503, { ok: false, message: 'MySQL belum menyala atau user/password salah (cek .env.local).' });
    }
    console.error('[crm]', e);
    return send(res, 500, { ok: false, message: 'Terjadi kesalahan server.' });
  }
}
