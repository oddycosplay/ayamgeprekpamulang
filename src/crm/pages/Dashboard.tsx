import { useQuery } from "@tanstack/react-query";

import { EmptyState, PaymentPill, StatusPill, relativeTime, useNow } from "../ui.tsx";
import { api } from "../api.ts";
import { rupiah } from "../types.ts";


const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function Dashboard() {
  const now = useNow();
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard, refetchInterval: 30000 });
  const recent = useQuery({
    queryKey: ["orders", "recent"],
    queryFn: () => api.orders("aktif"),
    refetchInterval: 30000,
  });
  const d = dash.data;
  const maxRevenue = Math.max(1, ...(d?.days.map((x) => x.revenue) ?? [1]));
  const weekRevenue = d?.days.reduce((a, x) => a + x.revenue, 0) ?? 0;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ijo">Ringkasan hari ini</p>
          <h1 className="mt-1 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">
            Gerobak lagi {d && d.activeOrders > 0 ? "ramai" : "santai"}.
          </h1>
        </div>
        <a
          href="#/pesanan"
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-kuning px-5 py-2.5 text-sm font-extrabold text-maroon-deep shadow-[3px_3px_0_0_#1f1512] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#1f1512]"
        >
          Buka papan pesanan →
        </a>
      </div>

      {/* KPI band: one dominant revenue figure + three supporting counts */}
      <section className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="af-grain relative overflow-hidden rounded-[2rem] bg-maroon p-7 text-ivory">
          <p className="text-sm font-bold text-kuning">Omzet hari ini</p>
          <p className="af-num mt-2 text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-none">
            {d ? rupiah(d.todayRevenue) : "..."}
          </p>
          <p className="mt-3 text-sm text-ivory/70">
            dari <span className="af-num font-bold text-ivory">{d?.todayOrders ?? 0}</span> pesanan, tidak termasuk yang dibatalkan
          </p>
          <svg viewBox="0 0 120 120" className="absolute -bottom-8 -right-6 h-40 w-40 opacity-25" aria-hidden="true">
            <path d="M20 80c10 22 45 32 70 8 14-14 14-40 4-54-4 18-15 32-32 40-14 6-28 6-42 6z" fill="#4caf50" />
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Kpi label="Baru masuk" value={d?.counts.baru ?? 0} tone="bg-kuning text-maroon-deep" />
          <Kpi label="Diproses" value={d?.counts.diproses ?? 0} tone="bg-crust-soft text-[#8a4300]" />
          <Kpi label="Siap diambil" value={d?.counts.siap ?? 0} tone="bg-ijo text-white" />
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* 7-day revenue bars */}
        <div className="rounded-[2rem] border-2 border-ink bg-white p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold">7 hari terakhir</h2>
            <p className="af-num text-sm font-bold text-ink-soft">{rupiah(weekRevenue)}</p>
          </div>
          <div className="mt-6 flex h-44 items-end gap-2 sm:gap-3">
            {(d?.days ?? []).map((x, i, arr) => {
              const isToday = i === arr.length - 1;
              const h = Math.max(4, Math.round((x.revenue / maxRevenue) * 100));
              const date = new Date(x.day + "T00:00:00Z");
              return (
                <div key={x.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="af-num text-[10px] font-bold text-ink-soft opacity-0 transition-opacity group-hover:opacity-100">
                    {x.orders}x
                  </span>
                  <div
                    title={`${rupiah(x.revenue)} · ${x.orders} pesanan`}
                    className={`w-full rounded-t-xl transition-colors ${isToday ? "bg-ijo" : "bg-maroon-soft group-hover:bg-kuning"}`}
                    style={{ height: `${h}%` }}
                  />
                  <span className={`text-[11px] font-bold ${isToday ? "text-ijo" : "text-ink-soft"}`}>
                    {isToday ? "Hari ini" : DAY_NAMES[date.getUTCDay()]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-[2rem] bg-paper p-6">
          <h2 className="font-display text-xl font-extrabold">Menu terlaris</h2>
          <p className="text-xs font-semibold text-ink-soft">7 hari terakhir</p>
          {d && d.topProducts.length ? (
            <ol className="mt-4 space-y-3">
              {d.topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3">
                  <span className="af-num grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ivory text-sm font-bold text-maroon">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold">{p.name}</span>
                  <span className="af-num text-sm font-bold text-ijo">{p.qty}x</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-6 text-sm text-ink-soft">Belum ada penjualan minggu ini.</p>
          )}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold">Pesanan yang masih jalan</h2>
          <a href="#/pesanan" className="text-sm font-bold text-ijo underline-offset-4 hover:underline">
            Lihat semua
          </a>
        </div>
        {recent.data && recent.data.length === 0 ? (
          <EmptyState title="Belum ada pesanan aktif" body="Pesanan dari website pelanggan akan muncul di sini otomatis." />
        ) : (
          <ul className="divide-y-2 divide-line overflow-hidden rounded-[1.5rem] border-2 border-line bg-white">
            {(recent.data ?? []).slice(0, 6).map((o) => (
              <li key={o.id}>
                <a
                  href={`#/pesanan?order=${o.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-ivory"
                >
                  <span className="af-num text-xs font-bold text-ink-soft">{o.code}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold">
                    {o.customer_name}
                    <span className="ml-2 font-medium text-ink-soft">{o.item_summary}</span>
                  </span>
                  <PaymentPill status={o.payment_status} />
                  <StatusPill status={o.status} />
                  <span className="af-num w-24 text-right text-sm font-bold">{rupiah(o.total)}</span>
                  <span className="w-20 text-right text-xs text-ink-soft">{now ? relativeTime(o.created_at, now) : ""}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`flex flex-col justify-between rounded-[1.5rem] p-4 ${tone}`}>
      <p className="text-xs font-bold leading-tight">{label}</p>
      <p className="af-num mt-6 text-4xl font-bold leading-none">{value}</p>
    </div>
  );
}
