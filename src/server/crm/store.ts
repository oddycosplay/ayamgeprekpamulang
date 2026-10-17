// Data layer CRM (MySQL): produk, pesanan, pengaturan.
import { randomUUID, randomBytes } from 'node:crypto';
import type { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { db } from './db.ts';
import type { Order, OrderEvent, OrderItem, Product, Settings } from '../../crm/types.ts';

const now = () => new Date().toISOString();

async function rows<T>(sql: string, args: unknown[] = []): Promise<T[]> {
  const [r] = await (await db()).query<RowDataPacket[]>(sql, args);
  return r as unknown as T[];
}
async function first<T>(sql: string, args: unknown[] = []): Promise<T | null> {
  return (await rows<T>(sql, args))[0] ?? null;
}
async function exec(sql: string, args: unknown[] = []) {
  await (await db()).execute(sql, args as never[]);
}
async function tx(fn: (c: PoolConnection) => Promise<void>) {
  const c = await (await db()).getConnection();
  try {
    await c.beginTransaction();
    await fn(c);
    await c.commit();
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }
}

// ---------- settings ----------
export async function getSettings(): Promise<Settings> {
  const list = await rows<{ k: string; v: string }>('SELECT k, v FROM settings');
  const map = Object.fromEntries(list.map((r) => [r.k, r.v]));
  return {
    tax_percent: Number(map.tax_percent ?? 11),
    accepting_orders: (map.accepting_orders ?? '1') === '1',
    whatsapp: map.whatsapp ?? '',
    store_name: map.store_name ?? 'Ayam Geprek Sambel Ijo Al-Fariz',
  };
}

export async function saveSettings(s: Settings) {
  await tx(async (c) => {
    for (const [k, v] of [
      ['tax_percent', String(s.tax_percent)],
      ['accepting_orders', s.accepting_orders ? '1' : '0'],
      ['whatsapp', s.whatsapp],
      ['store_name', s.store_name],
    ]) {
      await c.execute('INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [k, v]);
    }
  });
}

// ---------- products ----------
export async function listProducts(onlyActive = false): Promise<Product[]> {
  const where = ["id NOT IN ('geprek-original', 'geprek-extra-crispy')"];
  if (onlyActive) where.push('is_active = 1');
  return rows<Product>(`SELECT * FROM products WHERE ${where.join(' AND ')} ORDER BY sort_order, name`);
}

export type ProductInput = Omit<Product, 'updated_at' | 'id'> & { id?: string };

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'produk'
  );
}

export async function upsertProduct(p: ProductInput): Promise<string> {
  const ts = now();
  if (p.id) {
    await exec(
      `UPDATE products SET name=?, category=?, price=?, description=?, image_url=?, badge=?, spice_supported=?, is_active=?, sort_order=?, updated_at=? WHERE id=?`,
      [p.name, p.category, p.price, p.description, p.image_url, p.badge, p.spice_supported, p.is_active, p.sort_order, ts, p.id],
    );
    return p.id;
  }
  let id = slugify(p.name);
  if (await first('SELECT 1 FROM products WHERE id = ?', [id])) id = `${id}-${randomUUID().slice(0, 6)}`;
  await exec(
    `INSERT INTO products (id, name, category, price, description, image_url, badge, spice_supported, is_active, sort_order, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, p.name, p.category, p.price, p.description, p.image_url, p.badge, p.spice_supported, p.is_active, p.sort_order, ts, ts],
  );
  return id;
}

export async function setProductActive(id: string, active: boolean) {
  await exec('UPDATE products SET is_active=?, updated_at=? WHERE id=?', [active ? 1 : 0, now(), id]);
}

export async function deleteProduct(id: string) {
  await exec('DELETE FROM products WHERE id=?', [id]);
}

// ---------- orders ----------
export type NewOrderLine = { productId: string; qty: number; options?: string };
export type NewOrder = {
  customerName: string;
  customerPhone?: string;
  notes?: string;
  paymentMethod?: string;
  paymentStatus: Order['payment_status'];
  source: 'website' | 'manual';
  items: NewOrderLine[];
};

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function orderCode() {
  let s = '';
  for (const b of randomBytes(8)) s += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return `AF-${s}`;
}

export class OrderError extends Error {}

export async function createOrder(input: NewOrder) {
  if (!input.items.length) throw new OrderError('Pesanan kosong');
  const ids = [...new Set(input.items.map((i) => i.productId))];
  const products = await rows<Pick<Product, 'id' | 'name' | 'price' | 'is_active'>>(
    `SELECT id, name, price, is_active FROM products WHERE id IN (${ids.map(() => '?').join(',')})`,
    ids,
  );
  const byId = new Map(products.map((p) => [p.id, p]));

  // Harga selalu dari database, bukan dari browser.
  const lines = input.items.map((line) => {
    const p = byId.get(line.productId);
    if (!p || !p.is_active) throw new OrderError(`Produk tidak tersedia: ${line.productId}`);
    return {
      product_id: p.id,
      name: p.name,
      unit_price: p.price,
      qty: line.qty,
      options: (line.options ?? '').slice(0, 300),
      line_total: p.price * line.qty,
    };
  });

  const settings = await getSettings();
  const subtotal = lines.reduce((a, l) => a + l.line_total, 0);
  const tax = Math.round((subtotal * settings.tax_percent) / 100);
  const id = randomUUID();
  const code = orderCode();
  const ts = now();

  await tx(async (c) => {
    await c.execute(
      `INSERT INTO orders (id, code, customer_name, customer_phone, source, status, payment_status, payment_method, notes, subtotal, tax, total, created_at, updated_at)
       VALUES (?,?,?,?,?,'baru',?,?,?,?,?,?,?,?)`,
      [id, code, input.customerName, input.customerPhone ?? '', input.source, input.paymentStatus, input.paymentMethod ?? '', input.notes ?? '', subtotal, tax, subtotal + tax, ts, ts],
    );
    for (const l of lines) {
      await c.execute(
        `INSERT INTO order_items (order_id, product_id, name, unit_price, qty, options, line_total) VALUES (?,?,?,?,?,?,?)`,
        [id, l.product_id, l.name, l.unit_price, l.qty, l.options, l.line_total],
      );
    }
    await c.execute(`INSERT INTO order_events (order_id, kind, value, created_at) VALUES (?, 'status', 'baru', ?)`, [id, ts]);
  });
  return { id, code, subtotal, tax, total: subtotal + tax };
}

export type OrderFilter = { status?: string; q?: string };
export type OrderRow = Order & { item_summary: string | null };

export async function listOrders(f: OrderFilter): Promise<OrderRow[]> {
  const where: string[] = [];
  const args: unknown[] = [];
  if (f.status && f.status !== 'semua') {
    if (f.status === 'aktif') where.push("status IN ('baru','diproses','siap')");
    else {
      where.push('status = ?');
      args.push(f.status);
    }
  }
  if (f.q) {
    where.push('(customer_name LIKE ? OR code LIKE ? OR customer_phone LIKE ?)');
    const like = `%${f.q}%`;
    args.push(like, like, like);
  }
  return rows<OrderRow>(
    `SELECT o.*, (SELECT GROUP_CONCAT(CONCAT(qty, 'x ', name) ORDER BY id SEPARATOR ', ') FROM order_items WHERE order_id = o.id) AS item_summary
     FROM orders o ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC LIMIT 200`,
    args,
  );
}

export async function getOrder(by: { id?: string; code?: string }) {
  const order = by.id
    ? await first<Order>('SELECT * FROM orders WHERE id = ?', [by.id])
    : await first<Order>('SELECT * FROM orders WHERE code = ?', [by.code ?? '']);
  if (!order) return null;
  const [items, events] = await Promise.all([
    rows<OrderItem>('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', [order.id]),
    rows<OrderEvent>('SELECT id, kind, value, created_at FROM order_events WHERE order_id = ? ORDER BY id', [order.id]),
  ]);
  return { order, items, events };
}

export async function updateOrderField(id: string, kind: 'status' | 'payment', value: string) {
  const ts = now();
  const column = kind === 'status' ? 'status' : 'payment_status';
  await tx(async (c) => {
    await c.execute(`UPDATE orders SET ${column} = ?, updated_at = ? WHERE id = ?`, [value, ts, id]);
    await c.execute('INSERT INTO order_events (order_id, kind, value, created_at) VALUES (?,?,?,?)', [id, kind, value, ts]);
  });
}

// ---------- dashboard ----------
const WIB_OFFSET = 7 * 3600000;
const wibDay = (iso: string) => new Date(new Date(iso).getTime() + WIB_OFFSET).toISOString().slice(0, 10);

export async function dashboard() {
  const since = new Date(Date.now() - 8 * 86400000).toISOString();
  const [orders, top, active] = await Promise.all([
    rows<Pick<Order, 'id' | 'status' | 'total' | 'created_at'>>(
      'SELECT id, status, total, created_at FROM orders WHERE created_at >= ?',
      [since],
    ),
    rows<{ name: string; qty: number; revenue: number }>(
      `SELECT i.name AS name, CAST(SUM(i.qty) AS SIGNED) AS qty, CAST(SUM(i.line_total) AS SIGNED) AS revenue
       FROM order_items i JOIN orders o ON o.id = i.order_id
       WHERE o.created_at >= ? AND o.status <> 'batal' GROUP BY i.name ORDER BY qty DESC LIMIT 5`,
      [new Date(Date.now() - 7 * 86400000).toISOString()],
    ),
    first<{ n: number }>("SELECT COUNT(*) AS n FROM orders WHERE status IN ('baru','diproses','siap')"),
  ]);

  const today = wibDay(new Date().toISOString());
  const days: { day: string; orders: number; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) days.push({ day: wibDay(new Date(Date.now() - i * 86400000).toISOString()), orders: 0, revenue: 0 });
  const byDay = new Map(days.map((d) => [d.day, d]));
  const counts: Record<string, number> = { baru: 0, diproses: 0, siap: 0, selesai: 0, batal: 0 };
  let todayOrders = 0;
  let todayRevenue = 0;
  for (const o of orders) {
    const d = wibDay(o.created_at);
    if (o.status !== 'batal') {
      const slot = byDay.get(d);
      if (slot) {
        slot.orders++;
        slot.revenue += o.total;
      }
    }
    if (d === today) {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
      if (o.status !== 'batal') {
        todayOrders++;
        todayRevenue += o.total;
      }
    }
  }
  return { todayOrders, todayRevenue, counts, activeOrders: Number(active?.n ?? 0), days, topProducts: top };
}

// ---------- rate limit (di memori; cukup untuk server lokal) ----------
const hits = new Map<string, number[]>();
export function rateLimit(bucket: string, max: number, windowMs: number): boolean {
  const t = Date.now();
  const list = (hits.get(bucket) ?? []).filter((x) => x > t - windowMs);
  if (list.length >= max) {
    hits.set(bucket, list);
    return false;
  }
  list.push(t);
  hits.set(bucket, list);
  return true;
}
