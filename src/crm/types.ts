// Shared (client + server) CRM types and labels.

export const CATEGORIES = [
  { value: "paket", label: "Paket" },
  { value: "alacarte", label: "Alacarte" },
  { value: "tambahan", label: "Tambahan" },
  { value: "minuman", label: "Minuman" },
] as const;
export type Category = (typeof CATEGORIES)[number]["value"];

export const ORDER_STATUSES = [
  { value: "baru", label: "Baru" },
  { value: "diproses", label: "Diproses" },
  { value: "siap", label: "Siap Diambil" },
  { value: "selesai", label: "Selesai" },
  { value: "batal", label: "Dibatalkan" },
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export const PAYMENT_STATUSES = [
  { value: "belum_bayar", label: "Belum Bayar" },
  { value: "menunggu_verifikasi", label: "Cek Pembayaran" },
  { value: "lunas", label: "Lunas" },
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]["value"];

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image_url: string;
  badge: string;
  spice_supported: number;
  is_active: number;
  sort_order: number;
  updated_at: string;
};

export type OrderItem = {
  id: number;
  product_id: string | null;
  name: string;
  unit_price: number;
  qty: number;
  options: string;
  line_total: number;
};

export type Order = {
  id: string;
  code: string;
  customer_name: string;
  customer_phone: string;
  source: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  notes: string;
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
  updated_at: string;
};

export type OrderEvent = { id: number; kind: string; value: string; created_at: string };

export type Settings = {
  tax_percent: number;
  accepting_orders: boolean;
  whatsapp: string;
  store_name: string;
};

export function statusLabel(s: string) {
  return ORDER_STATUSES.find((x) => x.value === s)?.label ?? s;
}
export function paymentLabel(s: string) {
  return PAYMENT_STATUSES.find((x) => x.value === s)?.label ?? s;
}
export function categoryLabel(s: string) {
  return CATEGORIES.find((x) => x.value === s)?.label ?? s;
}

export function rupiah(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export function waktu(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
