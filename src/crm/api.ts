// Klien API CRM (same-origin, cookie sesi owner).
import type { Order, OrderEvent, OrderItem, Product, Settings } from './types.ts';

export type OrderRow = Order & { item_summary: string | null };
export type Dashboard = {
  todayOrders: number;
  todayRevenue: number;
  counts: Record<string, number>;
  activeOrders: number;
  days: { day: string; orders: number; revenue: number }[];
  topProducts: { name: string; qty: number; revenue: number }[];
};
export type OrderDetail = { order: Order; items: OrderItem[]; events: OrderEvent[] } | null;
export type TrackInfo = {
  ok: true;
  code: string;
  customer_name: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  items: { name: string; qty: number; options: string }[];
  events: { value: string; created_at: string }[];
};

async function call<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  const res = await fetch(path, {
    credentials: 'same-origin',
    ...rest,
    ...(json !== undefined
      ? { method: rest.method ?? 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(json) }
      : {}),
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) throw new Error(data.message || `Gagal (${res.status})`);
  return data as T;
}

export const api = {
  session: () => call<{ owner: boolean }>('/api/crm/session'),
  login: async (password: string) => {
    const res = await fetch('/api/crm/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    return { ok: !!data.ok, message: data.message ?? 'Gagal masuk.' };
  },
  logout: () => call<{ ok: boolean }>('/api/crm/logout', { json: {} }),
  dashboard: () => call<Dashboard>('/api/crm/dashboard'),
  products: () => call<Product[]>('/api/crm/products'),
  saveProduct: (p: Omit<Product, 'updated_at' | 'id'> & { id?: string }) =>
    call<{ ok: boolean; id: string }>('/api/crm/products', { json: p }),
  toggleProduct: (id: string, active: boolean) => call('/api/crm/products/toggle', { json: { id, active } }),
  removeProduct: (id: string) => call('/api/crm/products/delete', { json: { id } }),
  upload: (file: File) =>
    call<{ ok: boolean; url: string }>('/api/crm/upload', {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    }),
  orders: (status?: string, q?: string) => {
    const s = new URLSearchParams();
    if (status) s.set('status', status);
    if (q) s.set('q', q);
    return call<OrderRow[]>(`/api/crm/orders?${s}`);
  },
  order: (id: string) => call<OrderDetail>(`/api/crm/orders/${id}`),
  setStatus: (id: string, status: string) => call(`/api/crm/orders/${id}/status`, { json: { status } }),
  setPayment: (id: string, payment: string) => call(`/api/crm/orders/${id}/payment`, { json: { payment } }),
  createOrder: (d: {
    customerName: string;
    customerPhone: string;
    notes: string;
    paymentMethod: string;
    paid: boolean;
    items: { productId: string; qty: number; options: string }[];
  }) => call<{ ok: boolean; id: string; code: string }>('/api/crm/orders', { json: d }),
  settings: () => call<Settings>('/api/crm/settings'),
  saveSettings: (s: Settings) => call('/api/crm/settings', { json: s }),
  track: async (code: string): Promise<TrackInfo | null> => {
    const res = await fetch(`/api/public/track/${encodeURIComponent(code)}`);
    return res.ok ? ((await res.json()) as TrackInfo) : null;
  },
};
