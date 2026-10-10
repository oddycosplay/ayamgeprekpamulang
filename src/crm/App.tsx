import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';

import { api } from './api.ts';
import { navigate, useRoute } from './router.ts';
import { LogoMark, isUnauthorized } from './ui.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { OrdersPage } from './pages/Orders.tsx';
import { ProductsPage } from './pages/Products.tsx';
import { SettingsPage } from './pages/Settings.tsx';
import { TrackPage } from './pages/Track.tsx';

export function CrmApp() {
  const route = useRoute();

  // Halaman lacak pelanggan: publik, tanpa login.
  const track = route.path.match(/^\/lacak\/([A-Za-z0-9-]+)$/);
  if (track) return <TrackPage code={track[1]} />;

  return <OwnerGate path={route.path} />;
}

function OwnerGate({ path }: { path: string }) {
  const session = useQuery({ queryKey: ['session'], queryFn: api.session });
  if (session.isPending) return <div className="grid min-h-dvh place-items-center text-sm text-ink-soft">Memuat...</div>;
  if (session.isError) {
    return (
      <div className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <p className="font-display text-2xl font-extrabold">Server CRM tidak merespons</p>
          <p className="mt-2 text-sm text-ink-soft">Pastikan `npm run dev` sedang jalan dan MySQL menyala.</p>
        </div>
      </div>
    );
  }
  if (!session.data.owner) return <LoginPage />;
  return <OwnerShell path={path} />;
}

function LoginPage() {
  const qc = useQueryClient();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await api.login(password);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      if (!window.location.hash || window.location.hash === '#/login') navigate('/');
      await qc.invalidateQueries({ queryKey: ['session'] });
    } catch {
      setError('Server CRM tidak merespons.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <section className="af-grain relative hidden overflow-hidden bg-maroon text-ivory lg:flex lg:flex-col">
        <div className="af-awning h-5 w-full" />
        <div className="flex flex-1 flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <span className="font-display text-lg font-extrabold tracking-tight">Dapur Al-Fariz</span>
          </div>
          <div>
            <p className="font-display text-[clamp(2.5rem,4.5vw,4.25rem)] font-extrabold leading-[0.95] tracking-tight">
              Setiap ulegan
              <br />
              <span className="text-kuning">tercatat rapi.</span>
            </p>
            <p className="mt-5 max-w-md text-base text-ivory/75">
              Ubah harga menu, pantau pesanan dari website, dan tandai yang sudah siap diambil di gerobak depan UNPAM.
            </p>
          </div>
          <div className="relative">
            <img src="/menu/paket-geprek-nasi.jpg" alt="Paket ayam geprek sambel ijo dengan nasi" className="h-56 w-full rounded-[2rem] object-cover ring-4 ring-kuning" />
            <span className="absolute -top-4 right-6 rotate-3 rounded-full bg-ijo px-4 py-2 text-sm font-extrabold text-white shadow-lg">
              Sambel ijo uleg dadakan
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center px-5 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <LogoMark />
            <span className="font-display text-lg font-extrabold">Dapur Al-Fariz</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ijo">Khusus owner</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">Masuk ke dapur</h1>
          <p className="mt-2 text-sm text-ink-soft">Masukkan kata sandi owner untuk membuka CRM.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi"
                aria-label="Kata sandi owner"
                className="w-full rounded-2xl border-2 border-ink bg-white px-4 py-3.5 pr-20 text-base font-semibold focus:border-ijo focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-ink-soft hover:text-ink"
              >
                {show ? 'Sembunyi' : 'Lihat'}
              </button>
            </div>
            {error ? (
              <p role="alert" className="rounded-xl bg-cabai-soft px-3 py-2 text-sm font-semibold text-cabai">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className="group flex w-full items-center justify-between rounded-2xl bg-ijo px-5 py-4 text-base font-extrabold text-white shadow-[0_6px_0_0_#1b5e20] transition-all hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#1b5e20] active:translate-y-[6px] active:shadow-none disabled:opacity-60"
            >
              <span>{busy ? 'Memeriksa...' : 'Buka dapur'}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </form>
          <a href="/" className="mt-8 block text-center text-sm font-bold text-ink-soft hover:text-ink">
            ← Kembali ke website
          </a>
        </div>
      </section>
    </main>
  );
}

const NAV = [
  { to: '/', label: 'Ringkasan', icon: IconHome },
  { to: '/pesanan', label: 'Pesanan', icon: IconBag },
  { to: '/produk', label: 'Menu & Harga', icon: IconTag },
  { to: '/pengaturan', label: 'Pengaturan', icon: IconGear },
] as const;

function ding() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.14);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + i * 0.14 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.14 + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.14);
      o.stop(ctx.currentTime + i * 0.14 + 0.32);
    });
  } catch {
    // audio tidak tersedia; toast sudah cukup
  }
}

function OwnerShell({ path }: { path: string }) {
  const qc = useQueryClient();

  // Kalau sesi habis di tengah jalan, kembali ke login.
  useEffect(() => {
    return qc.getQueryCache().subscribe((ev) => {
      if (ev.type === 'updated' && isUnauthorized(ev.query.state.error)) {
        void qc.invalidateQueries({ queryKey: ['session'] });
      }
    });
  }, [qc]);

  const fresh = useQuery({
    queryKey: ['orders', 'baru-watch'],
    queryFn: () => api.orders('baru'),
    refetchInterval: 15000,
  });
  const newCount = fresh.data?.length ?? 0;
  const seen = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!fresh.data) return;
    const ids = new Set(fresh.data.map((o) => o.id));
    if (seen.current) {
      const arrived = fresh.data.filter((o) => !seen.current!.has(o.id));
      if (arrived.length) {
        ding();
        toast.success(`Pesanan baru dari ${arrived[0].customer_name}`, {
          description: arrived.length > 1 ? `+${arrived.length - 1} pesanan lain` : arrived[0].item_summary ?? '',
        });
        void qc.invalidateQueries({ queryKey: ['orders'] });
        void qc.invalidateQueries({ queryKey: ['dashboard'] });
      }
    }
    seen.current = ids;
    document.title = newCount ? `(${newCount}) Pesanan baru · Dapur Al-Fariz` : 'Dapur Al-Fariz CRM';
  }, [fresh.data, newCount, qc]);

  async function doLogout() {
    await api.logout();
    qc.clear();
    navigate('/');
  }

  const isActive = (to: string) => (to === '/' ? path === '/' : path.startsWith(to));
  let page: ReactNode;
  if (path.startsWith('/pesanan')) page = <OrdersPage />;
  else if (path.startsWith('/produk')) page = <ProductsPage />;
  else if (path.startsWith('/pengaturan')) page = <SettingsPage />;
  else page = <Dashboard />;

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="af-grain sticky top-0 hidden h-dvh flex-col bg-maroon text-ivory lg:flex">
        <div className="flex items-center gap-3 px-6 pb-8 pt-7">
          <LogoMark />
          <div className="leading-tight">
            <p className="font-display text-lg font-extrabold">Dapur Al-Fariz</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-kuning">Owner CRM</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <a
              key={to}
              href={`#${to}`}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${isActive(to) ? 'bg-ivory text-maroon' : 'text-ivory/70 hover:bg-white/10 hover:text-ivory'}`}
            >
              <Icon />
              <span className="flex-1">{label}</span>
              {to === '/pesanan' && newCount > 0 ? (
                <span className="af-new af-num grid h-6 min-w-6 place-items-center rounded-full bg-kuning px-1.5 text-xs font-bold text-maroon-deep">
                  {newCount}
                </span>
              ) : null}
            </a>
          ))}
        </nav>
        <div className="space-y-1 px-3 pb-3">
          <a href="/" className="block rounded-2xl px-4 py-3 text-sm font-bold text-ivory/60 hover:bg-white/10 hover:text-ivory">
            Lihat website
          </a>
          <button onClick={doLogout} className="w-full rounded-2xl px-4 py-3 text-left text-sm font-bold text-ivory/60 hover:bg-white/10 hover:text-ivory">
            Keluar
          </button>
        </div>
        <div className="af-awning h-4 w-full" />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between bg-maroon px-4 py-3 text-ivory lg:hidden">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <span className="font-display font-extrabold">Dapur Al-Fariz</span>
        </div>
        <button onClick={doLogout} className="rounded-full border border-ivory/30 px-3 py-1 text-xs font-bold">
          Keluar
        </button>
      </header>

      <main className="min-w-0 px-4 pb-28 pt-6 sm:px-8 lg:px-10 lg:pb-12 lg:pt-10">{page}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t-2 border-ink bg-ivory lg:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <a
            key={to}
            href={`#${to}`}
            className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold ${isActive(to) ? 'text-maroon' : 'text-ink-soft'}`}
          >
            <Icon />
            {label.split(' ')[0]}
            {to === '/pesanan' && newCount > 0 ? (
              <span className="af-num absolute right-[22%] top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-kuning px-1 text-[10px] text-maroon-deep">
                {newCount}
              </span>
            ) : null}
          </a>
        ))}
      </nav>
    </div>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12V4h8l10 10-8 8z" />
      <circle cx="7.5" cy="8.5" r="1.5" />
    </svg>
  );
}
function IconGear() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}
