import { useQuery } from '@tanstack/react-query';

import { api } from '../api.ts';
import { LogoMark } from '../ui.tsx';
import { paymentLabel, rupiah, waktu } from '../types.ts';

const STEPS = [
  { value: 'baru', label: 'Pesanan diterima', hint: 'Pesananmu sudah masuk ke dapur.' },
  { value: 'diproses', label: 'Sedang diuleg', hint: 'Ayam digoreng, sambel ijo diuleg dadakan.' },
  { value: 'siap', label: 'Siap diambil', hint: 'Ambil di gerobak depan Kampus UNPAM.' },
  { value: 'selesai', label: 'Selesai', hint: 'Selamat menikmati!' },
];

// Halaman lacak untuk pelanggan (publik). Menyegarkan otomatis tiap 20 detik.
export function TrackPage({ code }: { code: string }) {
  const q = useQuery({ queryKey: ['track', code], queryFn: () => api.track(code), refetchInterval: 20000 });
  const data = q.data;
  const step = data ? STEPS.findIndex((x) => x.value === data.status) : -1;

  return (
    <main className="min-h-dvh bg-ivory">
      <div className="af-awning h-3 w-full" />
      <div className="mx-auto max-w-lg px-4 py-10">
        <a href="/" className="flex items-center gap-3">
          <LogoMark />
          <div className="leading-tight">
            <p className="font-display text-lg font-extrabold">Ayam Geprek Al-Fariz</p>
            <p className="text-xs font-semibold text-ink-soft">Sambel ijo uleg dadakan</p>
          </div>
        </a>

        {q.isPending ? (
          <p className="mt-10 text-sm text-ink-soft">Memuat pesanan...</p>
        ) : !data ? (
          <div className="mt-10 rounded-[2rem] border-2 border-ink bg-white p-8 text-center">
            <p className="af-num text-sm font-bold text-ink-soft">{code}</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold">Pesanan tidak ditemukan</h1>
            <p className="mt-2 text-sm text-ink-soft">Periksa lagi kode pesananmu, atau hubungi kami lewat WhatsApp.</p>
          </div>
        ) : data.status === 'batal' ? (
          <div className="mt-10 rounded-[2rem] bg-cabai-soft p-8 text-center">
            <p className="af-num text-sm font-bold text-cabai">{data.code}</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-cabai">Pesanan dibatalkan</h1>
            <p className="mt-2 text-sm">Hubungi kami lewat WhatsApp jika ada pertanyaan.</p>
          </div>
        ) : (
          <>
            <section className="af-grain mt-8 rounded-[2rem] bg-maroon p-7 text-ivory">
              <p className="text-sm text-ivory/70">Halo {data.customer_name}, pesanan</p>
              <p className="af-num mt-1 text-2xl font-bold text-kuning">{data.code}</p>
              <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight">{STEPS[step]?.label}</h1>
              <p className="mt-1 text-sm text-ivory/80">{STEPS[step]?.hint}</p>
            </section>

            <ol className="mt-6">
              {STEPS.map((s, i) => {
                const reached = step >= i;
                const at = data.events.find((e) => e.value === s.value);
                return (
                  <li key={s.value} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className={`grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-extrabold ${reached ? 'border-ijo bg-ijo text-white' : 'border-line bg-white text-ink-soft'}`}>
                        {reached ? '✓' : i + 1}
                      </span>
                      {i < STEPS.length - 1 ? <span className={`w-0.5 flex-1 ${reached ? 'bg-ijo' : 'bg-line'}`} /> : null}
                    </div>
                    <div className="pb-6 pt-1.5">
                      <p className={`text-sm font-extrabold ${reached ? 'text-ink' : 'text-ink-soft'}`}>{s.label}</p>
                      {at ? <p className="text-xs text-ink-soft">{waktu(at.created_at)}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ol>

            <section className="rounded-[1.5rem] border-2 border-line bg-white p-5">
              <ul className="space-y-2 text-sm">
                {data.items.map((it, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="af-num font-bold text-maroon">{it.qty}x</span>
                    <span>
                      <span className="font-bold">{it.name}</span>
                      {it.options ? <span className="block text-xs text-ink-soft">{it.options}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t-2 border-ink pt-3">
                <span className="text-xs font-bold text-ink-soft">{paymentLabel(data.payment_status)}</span>
                <span className="af-num text-lg font-bold">{rupiah(data.total)}</span>
              </div>
            </section>
            <p className="mt-4 text-center text-xs text-ink-soft">Status diperbarui otomatis.</p>
          </>
        )}
      </div>
    </main>
  );
}
