import { useSyncExternalStore } from 'react';
import { MENU_ITEMS } from '../data/menuData.ts';
import { MenuItem } from '../types.ts';

// Owner CRM (Dapur Al-Fariz). Menu & harga diambil dari sini, dan setiap
// pesanan dikirim ke sini supaya owner bisa melacaknya. Kalau CRM tidak bisa
// dihubungi, website tetap jalan dengan data lokal + WhatsApp seperti biasa.
// CRM jalan di server yang sama (npm run dev), jadi cukup alamat relatif.
export const CRM_URL: string = (import.meta as { env?: Record<string, string> }).env?.VITE_CRM_URL || '';

type CrmProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  badge: string;
  spice_supported: boolean;
  image_url: string;
};

export type LiveMenu = {
  items: MenuItem[];
  addonPrices: { extraSambel: number; tambahNasi: number };
  taxPercent: number;
  acceptingOrders: boolean;
  fromCrm: boolean;
};

let state: LiveMenu = {
  items: MENU_ITEMS,
  addonPrices: { extraSambel: 3000, tambahNasi: 5000 },
  taxPercent: 11,
  acceptingOrders: true,
  fromCrm: false,
};
const listeners = new Set<() => void>();
let started = false;

function emit(next: LiveMenu) {
  state = next;
  listeners.forEach((l) => l());
}

async function loadMenu() {
  try {
    const res = await fetch(`${CRM_URL}/api/public/menu`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = (await res.json()) as {
      accepting_orders: boolean;
      tax_percent: number;
      products: CrmProduct[];
    };
    const local = new Map(MENU_ITEMS.map((m) => [m.id, m]));
    const items: MenuItem[] = data.products
      .filter((p) => p.category === 'paket' || p.category === 'alacarte' || p.category === 'minuman')
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category as MenuItem['category'],
        price: p.price,
        description: p.description,
        // Foto lokal tetap dipakai untuk menu bawaan; menu baru pakai foto dari CRM.
        image: local.get(p.id)?.image ?? p.image_url,
        badge: p.badge || undefined,
        spiceLevelSupported: p.spice_supported,
      }));
    const price = (id: string, fallback: number) => data.products.find((p) => p.id === id)?.price ?? fallback;
    emit({
      items: items.length ? items : MENU_ITEMS,
      addonPrices: {
        extraSambel: price('extra-sambel', state.addonPrices.extraSambel),
        tambahNasi: price('tambah-nasi', state.addonPrices.tambahNasi),
      },
      taxPercent: data.tax_percent,
      acceptingOrders: data.accepting_orders,
      fromCrm: true,
    });
  } catch {
    // CRM tidak terjangkau: tetap pakai menu lokal.
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!started) {
    started = true;
    void loadMenu();
    // Perubahan owner (harga, menu disembunyikan) ikut muncul tanpa reload.
    setInterval(() => void loadMenu(), 60000);
    window.addEventListener('focus', () => void loadMenu());
  }
  return () => listeners.delete(cb);
}

export function useLiveMenu(): LiveMenu {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function liveMenuSnapshot(): LiveMenu {
  return state;
}

export type CrmOrderInput = {
  customerName: string;
  notes: string;
  paymentMethod: string;
  paid: boolean;
  menuId: string;
  portion: number;
  options: string;
  extraSambel: boolean;
  tambahNasi: boolean;
};

export type CrmOrderResult = { code: string; trackUrl: string };

export async function submitOrderToCrm(o: CrmOrderInput): Promise<CrmOrderResult | null> {
  const items = [{ productId: o.menuId, qty: o.portion, options: o.options }];
  if (o.extraSambel) items.push({ productId: 'extra-sambel', qty: o.portion, options: '' });
  if (o.tambahNasi) items.push({ productId: 'tambah-nasi', qty: o.portion, options: '' });
  try {
    const res = await fetch(`${CRM_URL}/api/public/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        customerName: o.customerName.slice(0, 60),
        notes: o.notes.slice(0, 300),
        paymentMethod: o.paymentMethod.slice(0, 60),
        paidClaim: o.paid,
        items,
      }),
    });
    const data = (await res.json()) as { ok: boolean; code?: string; trackUrl?: string };
    if (!data.ok || !data.code || !data.trackUrl) return null;
    return { code: data.code, trackUrl: data.trackUrl };
  } catch {
    return null;
  }
}
