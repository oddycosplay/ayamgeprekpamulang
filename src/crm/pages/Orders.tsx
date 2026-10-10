import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setQuery, useRoute } from "../router.ts";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  EmptyState,
  Field,
  PaymentPill,
  Sheet,
  StatusPill,
  inputCls,
  relativeTime,
  useNow,
} from "../ui.tsx";
import { api } from "../api.ts";
import type { OrderRow } from "../api.ts";
import { ORDER_STATUSES, PAYMENT_STATUSES, paymentLabel, rupiah, statusLabel, waktu } from "../types.ts";


const NEXT: Record<string, { to: string; label: string } | undefined> = {
  baru: { to: "diproses", label: "Mulai masak" },
  diproses: { to: "siap", label: "Siap diambil" },
  siap: { to: "selesai", label: "Sudah diambil" },
};

const BOARD = [
  { status: "baru", title: "Baru masuk", tone: "bg-kuning" },
  { status: "diproses", title: "Sedang dimasak", tone: "bg-crust" },
  { status: "siap", title: "Siap diambil", tone: "bg-ijo" },
] as const;

export function OrdersPage() {
  const { query } = useRoute();
  const search = { order: query.get("order") ?? undefined, status: query.get("status") ?? undefined };
  const view = query.get("view") === "daftar" ? "daftar" : "papan";
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const qc = useQueryClient();
  const now = useNow();

  const listStatus = view === "papan" ? "aktif" : (search.status ?? "semua");
  const orders = useQuery({
    queryKey: ["orders", "list", listStatus, q],
    queryFn: () => api.orders(listStatus, q || undefined),
    refetchInterval: 15000,
  });

  const advance = useMutation({
    mutationFn: (v: { id: string; status: string }) => api.setStatus(v.id, v.status),
    onSuccess: (_r, v) => {
      toast.success(`Status jadi "${statusLabel(v.status)}"`);
      void qc.invalidateQueries({ queryKey: ["orders"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["order", v.id] });
    },
    onError: () => toast.error("Gagal mengubah status"),
  });

  const openOrder = (id?: string) => setQuery({ order: id });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ijo">Lacak pesanan</p>
          <h1 className="mt-1 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">Pesanan</h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-maroon px-5 py-3 text-sm font-extrabold text-ivory transition-colors hover:bg-maroon-deep"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-kuning text-maroon-deep">+</span>
          Catat pesanan manual
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border-2 border-ink p-1">
          {(["papan", "daftar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setQuery({ view: v, order: undefined })}
              className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize ${view === v ? "bg-ink text-ivory" : "text-ink-soft hover:text-ink"}`}
            >
              {v === "papan" ? "Papan dapur" : "Semua riwayat"}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama, kode, atau nomor HP"
          aria-label="Cari pesanan"
          className={`${inputCls} max-w-xs flex-1 rounded-full`}
        />
      </div>

      {view === "daftar" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {[{ value: "semua", label: "Semua" }, ...ORDER_STATUSES].map((s) => (
            <button
              key={s.value}
              onClick={() => setQuery({ status: s.value })}
              className={`rounded-full border-2 px-3.5 py-1 text-xs font-bold ${listStatus === s.value ? "border-maroon bg-maroon text-ivory" : "border-line bg-white text-ink-soft hover:border-ink"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}

      {view === "papan" ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {BOARD.map((col) => {
            const items = (orders.data ?? []).filter((o) => o.status === col.status);
            return (
              <section key={col.status} className="rounded-[1.75rem] bg-paper p-3">
                <header className="flex items-center gap-2 px-2 pb-3 pt-1">
                  <span className={`h-3 w-3 rounded-full ${col.tone}`} />
                  <h2 className="flex-1 font-display text-lg font-extrabold">{col.title}</h2>
                  <span className="af-num text-sm font-bold text-ink-soft">{items.length}</span>
                </header>
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <p className="rounded-2xl border-2 border-dashed border-line px-4 py-8 text-center text-sm text-ink-soft">
                      Kosong
                    </p>
                  ) : (
                    items
                      .slice()
                      .reverse()
                      .map((o) => (
                        <OrderCard
                          key={o.id}
                          o={o}
                          now={now}
                          onOpen={() => openOrder(o.id)}
                          onAdvance={(to) => advance.mutate({ id: o.id, status: to })}
                          busy={advance.isPending && advance.variables?.id === o.id}
                        />
                      ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : orders.data && orders.data.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Tidak ada pesanan" body="Coba ganti filter atau kata pencarian." />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-[1.5rem] border-2 border-ink bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b-2 border-ink text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-5 py-3">Kode</th>
                <th className="px-3 py-3">Pelanggan</th>
                <th className="px-3 py-3">Isi pesanan</th>
                <th className="px-3 py-3">Waktu</th>
                <th className="px-3 py-3">Bayar</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(orders.data ?? []).map((o) => (
                <tr key={o.id} onClick={() => openOrder(o.id)} className="cursor-pointer hover:bg-ivory">
                  <td className="af-num px-5 py-3 text-xs font-bold">{o.code}</td>
                  <td className="px-3 py-3 font-bold">{o.customer_name}</td>
                  <td className="max-w-[240px] truncate px-3 py-3 text-ink-soft">{o.item_summary}</td>
                  <td className="px-3 py-3 text-xs text-ink-soft">{waktu(o.created_at)}</td>
                  <td className="px-3 py-3">
                    <PaymentPill status={o.payment_status} />
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="af-num px-5 py-3 text-right font-bold">{rupiah(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OrderDetailSheet id={search.order} onClose={() => openOrder(undefined)} />
      <ManualOrderSheet open={creating} onClose={() => setCreating(false)} onCreated={(id) => openOrder(id)} />
    </div>
  );
}

function OrderCard({
  o,
  now,
  onOpen,
  onAdvance,
  busy,
}: {
  o: OrderRow;
  now: number;
  onOpen: () => void;
  onAdvance: (to: string) => void;
  busy: boolean;
}) {
  const next = NEXT[o.status];
  const waitingMin = now ? Math.floor((now - new Date(o.created_at).getTime()) / 60000) : 0;
  const late = o.status !== "siap" && waitingMin >= 20;
  return (
    <article className={`rounded-2xl border-2 bg-white p-4 transition-shadow hover:shadow-[4px_4px_0_0_#1f1512] ${o.status === "baru" ? "border-ink" : "border-line"}`}>
      <button onClick={onOpen} className="block w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-extrabold leading-tight">{o.customer_name}</p>
            <p className="af-num text-[11px] font-bold text-ink-soft">{o.code}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${late ? "bg-cabai-soft text-cabai" : "bg-paper text-ink-soft"}`}>
            {now ? relativeTime(o.created_at, now) : ""}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm font-medium text-ink">{o.item_summary}</p>
        {o.notes ? <p className="mt-1 line-clamp-1 text-xs italic text-ink-soft">"{o.notes}"</p> : null}
        <div className="mt-3 flex items-center justify-between gap-2">
          <PaymentPill status={o.payment_status} />
          <span className="af-num text-sm font-bold">{rupiah(o.total)}</span>
        </div>
      </button>
      {next ? (
        <button
          onClick={() => onAdvance(next.to)}
          disabled={busy}
          className="mt-3 flex w-full items-center justify-between rounded-xl bg-ink px-4 py-2.5 text-sm font-extrabold text-ivory transition-colors hover:bg-ijo disabled:opacity-50"
        >
          {busy ? "Menyimpan..." : next.label}
          <span aria-hidden="true">→</span>
        </button>
      ) : null}
    </article>
  );
}

function waLink(phone: string, text: string) {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("0")) p = "62" + p.slice(1);
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
}

function OrderDetailSheet({ id, onClose }: { id?: string; onClose: () => void }) {
  const qc = useQueryClient();
  const detail = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.order(id!),
    enabled: !!id,
  });
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["order", id] });
    void qc.invalidateQueries({ queryKey: ["orders"] });
    void qc.invalidateQueries({ queryKey: ["dashboard"] });
  };
  const status = useMutation({
    mutationFn: (s: string) => api.setStatus(id!, s),
    onSuccess: refresh,
    onError: () => toast.error("Gagal mengubah status"),
  });
  const pay = useMutation({
    mutationFn: (p: string) => api.setPayment(id!, p),
    onSuccess: refresh,
    onError: () => toast.error("Gagal mengubah pembayaran"),
  });

  const data = detail.data;
  const o = data?.order;
  const trackUrl = o && typeof window !== "undefined" ? `${window.location.origin}/crm.html#/lacak/${o.code}` : "";

  return (
    <Sheet
      open={!!id}
      onClose={onClose}
      title={
        o ? (
          <span className="flex items-center gap-3">
            {o.customer_name} <StatusPill status={o.status} />
          </span>
        ) : (
          "Memuat..."
        )
      }
    >
      {!o ? (
        <p className="text-sm text-ink-soft">{detail.isFetched ? "Pesanan tidak ditemukan." : "Memuat pesanan..."}</p>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="af-num font-bold">{o.code}</span>
            <span className="text-ink-soft">{waktu(o.created_at)}</span>
            <span className="text-ink-soft">{o.source === "website" ? "Dari website" : "Dicatat manual"}</span>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft">Status pesanan</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => status.mutate(s.value)}
                  disabled={status.isPending}
                  className={`rounded-xl border-2 px-2 py-2 text-xs font-extrabold ${o.status === s.value ? "border-ink bg-ink text-ivory" : "border-line bg-white hover:border-ink"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft">
              Pembayaran {o.payment_method ? `· ${o.payment_method}` : ""}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => pay.mutate(s.value)}
                  disabled={pay.isPending}
                  className={`rounded-xl border-2 px-2 py-2 text-xs font-extrabold ${o.payment_status === s.value ? "border-ijo bg-ijo text-white" : "border-line bg-white hover:border-ijo"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {o.payment_status === "menunggu_verifikasi" ? (
              <p className="mt-2 rounded-xl bg-crust-soft px-3 py-2 text-xs font-semibold text-[#8a4300]">
                Pelanggan menyatakan sudah bayar. Cek mutasi QRIS / e-wallet lalu tandai Lunas.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border-2 border-line bg-white">
            <ul className="divide-y divide-line">
              {data.items.map((it) => (
                <li key={it.id} className="flex gap-3 px-4 py-3">
                  <span className="af-num w-8 font-bold text-maroon">{it.qty}x</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{it.name}</p>
                    {it.options ? <p className="text-xs text-ink-soft">{it.options}</p> : null}
                  </div>
                  <span className="af-num text-sm font-bold">{rupiah(it.line_total)}</span>
                </li>
              ))}
            </ul>
            <dl className="af-num space-y-1 border-t-2 border-ink px-4 py-3 text-sm">
              <div className="flex justify-between text-ink-soft">
                <dt>Subtotal</dt>
                <dd>{rupiah(o.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink-soft">
                <dt>PPN</dt>
                <dd>{rupiah(o.tax)}</dd>
              </div>
              <div className="flex justify-between text-base font-bold">
                <dt>Total</dt>
                <dd>{rupiah(o.total)}</dd>
              </div>
            </dl>
          </div>

          {o.notes ? (
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-ink-soft">Catatan pelanggan</p>
              <p className="rounded-xl bg-kuning-soft px-4 py-3 text-sm">{o.notes}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {o.customer_phone ? (
              <a
                href={waLink(
                  o.customer_phone,
                  `Halo ${o.customer_name}, pesanan ${o.code} di Ayam Geprek Al-Fariz statusnya: ${statusLabel(o.status)}. Cek di ${trackUrl}`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-extrabold text-white hover:bg-[#1ebe5a]"
              >
                Kabari via WhatsApp
              </a>
            ) : null}
            <button
              onClick={() => {
                void navigator.clipboard.writeText(trackUrl).then(() => toast.success("Link lacak disalin"));
              }}
              className="rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold hover:bg-ink hover:text-ivory"
            >
              Salin link lacak
            </button>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-soft">Riwayat</p>
            <ol className="relative space-y-3 border-l-2 border-line pl-5">
              {data.events.map((ev) => (
                <li key={ev.id} className="relative">
                  <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-ivory ${ev.kind === "status" ? "bg-maroon" : "bg-ijo"}`} />
                  <p className="text-sm font-bold">
                    {ev.kind === "status" ? statusLabel(ev.value) : `Pembayaran: ${paymentLabel(ev.value)}`}
                  </p>
                  <p className="text-xs text-ink-soft">{waktu(ev.created_at)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </Sheet>
  );
}

type Line = { productId: string; qty: number; options: string };

function ManualOrderSheet({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const qc = useQueryClient();
  const products = useQuery({ queryKey: ["products"], queryFn: api.products, enabled: open });
  const settings = useQuery({ queryKey: ["settings"], queryFn: api.settings, enabled: open });
  const active = (products.data ?? []).filter((p) => p.is_active);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState("Tunai");
  const [paid, setPaid] = useState(true);
  const [lines, setLines] = useState<Line[]>([{ productId: "", qty: 1, options: "" }]);
  const [busy, setBusy] = useState(false);

  const priceOf = (id: string) => active.find((p) => p.id === id)?.price ?? 0;
  const subtotal = lines.reduce((a, l) => a + priceOf(l.productId) * l.qty, 0);
  const tax = Math.round((subtotal * (settings.data?.tax_percent ?? 11)) / 100);

  const reset = () => {
    setName("");
    setPhone("");
    setNotes("");
    setPaid(true);
    setMethod("Tunai");
    setLines([{ productId: "", qty: 1, options: "" }]);
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const items = lines.filter((l) => l.productId);
    if (!items.length) {
      toast.error("Pilih minimal satu menu");
      return;
    }
    setBusy(true);
    try {
      const res = await api.createOrder({ customerName: name, customerPhone: phone, notes, paymentMethod: method, paid, items });
      toast.success(`Pesanan ${res.code} tercatat`);
      void qc.invalidateQueries({ queryKey: ["orders"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      reset();
      onClose();
      onCreated(res.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan pesanan");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Catat pesanan manual" wide>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama pelanggan">
            <input required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Contoh: Dimas" />
          </Field>
          <Field label="No. WhatsApp" hint="Opsional, untuk kabari status">
            <input inputMode="tel" maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="08xxxxxxxxxx" />
          </Field>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft">Isi pesanan</p>
          <div className="space-y-2">
            {lines.map((l, i) => (
              <div key={i} className="grid grid-cols-[1fr_72px_32px] gap-2 rounded-2xl bg-paper p-2 sm:grid-cols-[1.3fr_1fr_72px_32px]">
                <select
                  aria-label="Menu"
                  value={l.productId}
                  onChange={(e) => setLines((ls) => ls.map((x, j) => (j === i ? { ...x, productId: e.target.value } : x)))}
                  className={inputCls}
                >
                  <option value="">Pilih menu...</option>
                  {active.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({rupiah(p.price)})
                    </option>
                  ))}
                </select>
                <input
                  aria-label="Keterangan"
                  placeholder="Level pedas, dll"
                  maxLength={200}
                  value={l.options}
                  onChange={(e) => setLines((ls) => ls.map((x, j) => (j === i ? { ...x, options: e.target.value } : x)))}
                  className={`${inputCls} col-span-3 row-start-2 sm:col-span-1 sm:row-start-auto`}
                />
                <input
                  aria-label="Jumlah"
                  type="number"
                  min={1}
                  max={500}
                  value={l.qty}
                  onChange={(e) =>
                    setLines((ls) => ls.map((x, j) => (j === i ? { ...x, qty: Math.max(1, Number(e.target.value) || 1) } : x)))
                  }
                  className={`${inputCls} af-num text-center`}
                />
                <button
                  type="button"
                  aria-label="Hapus baris"
                  onClick={() => setLines((ls) => (ls.length > 1 ? ls.filter((_, j) => j !== i) : ls))}
                  className="text-xl font-bold text-ink-soft hover:text-cabai"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLines((ls) => [...ls, { productId: "", qty: 1, options: "" }])}
            className="mt-2 text-sm font-bold text-ijo hover:underline"
          >
            + Tambah menu lain
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Metode bayar">
            <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
              {["Tunai", "QRIS", "E-Wallet", "Transfer Bank"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-3 self-end rounded-xl border-2 border-line bg-white px-4 py-2.5">
            <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="h-5 w-5 accent-[#2e7d32]" />
            <span className="text-sm font-bold">Sudah dibayar</span>
          </label>
        </div>

        <Field label="Catatan">
          <textarea maxLength={300} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} />
        </Field>

        <div className="af-num flex items-center justify-between rounded-2xl bg-maroon px-5 py-4 text-ivory">
          <span className="text-sm">
            Subtotal {rupiah(subtotal)} + PPN {rupiah(tax)}
          </span>
          <span className="text-xl font-bold text-kuning">{rupiah(subtotal + tax)}</span>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-2xl bg-ijo px-5 py-3.5 text-base font-extrabold text-white shadow-[0_5px_0_0_#1b5e20] transition-all hover:translate-y-[2px] hover:shadow-[0_3px_0_0_#1b5e20] disabled:opacity-60"
        >
          {busy ? "Menyimpan..." : "Simpan pesanan"}
        </button>
      </form>
    </Sheet>
  );
}
