import { useEffect, useState, type ReactNode } from "react";

import { paymentLabel, statusLabel } from "./types";

// Brand mark: a sambel-ijo chili curled inside the gerobak badge.
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="2" y="2" width="44" height="44" rx="14" fill="#f5c518" />
      <path
        d="M14 30c3 6 13 9 20 2 4-4 4-11 1-15-1 5-4 9-9 11-4 2-8 2-12 2z"
        fill="#2e7d32"
      />
      <path d="M33 15c1-3 4-5 7-4-2 1-3 3-3 5" stroke="#5e0d10" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M18 31c4 0 9-2 12-6" stroke="#a5d6a7" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const STATUS_STYLE: Record<string, string> = {
  baru: "bg-kuning text-maroon-deep",
  diproses: "bg-crust-soft text-[#8a4300]",
  siap: "bg-ijo text-white",
  selesai: "bg-paper text-ink-soft",
  batal: "bg-cabai-soft text-cabai line-through decoration-1",
};

export function StatusPill({ status, className = "" }: { status: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide ${STATUS_STYLE[status] ?? "bg-paper"} ${className}`}
    >
      {statusLabel(status)}
    </span>
  );
}

const PAY_STYLE: Record<string, string> = {
  belum_bayar: "border-line text-ink-soft",
  menunggu_verifikasi: "border-crust text-[#8a4300]",
  lunas: "border-ijo text-ijo",
};

export function PaymentPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border-[1.5px] px-2 py-0.5 text-[11px] font-bold ${PAY_STYLE[status] ?? ""}`}>
      {status === "lunas" ? "✓ " : ""}
      {paymentLabel(status)}
    </span>
  );
}

export function relativeTime(iso: string, nowMs: number) {
  const diff = Math.max(0, nowMs - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

// Re-renders every 30s so "x mnt lalu" stays fresh. Starts at 0 on the
// server render and fills in after mount (SSR-safe).
export function useNow() {
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button aria-label="Tutup" className="absolute inset-0 bg-maroon-deep/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={`relative flex h-full w-full flex-col bg-ivory shadow-2xl ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"}`}
      >
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-4">
          <div className="min-w-0 font-display text-xl font-extrabold">{title}</div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink text-lg font-bold hover:bg-ink hover:text-ivory"
            aria-label="Tutup panel"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-ink-soft">{hint}</span> : null}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink placeholder:text-ink-soft/60 focus:border-ijo focus:outline-none";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border-2 transition-colors ${checked ? "border-ijo bg-ijo" : "border-line bg-paper"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-line px-6 py-12 text-center">
      <svg viewBox="0 0 64 40" className="mx-auto h-10 w-16" aria-hidden="true">
        <path d="M4 30h56" stroke="#5e0d10" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 30c0-10 9-18 20-18s20 8 20 18" fill="#f5c518" stroke="#5e0d10" strokeWidth="3" />
        <path d="M32 12V6" stroke="#5e0d10" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p className="mt-3 font-display text-lg font-extrabold">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">{body}</p>
    </div>
  );
}

export function isUnauthorized(e: unknown) {
  return e instanceof Error && e.message.includes("UNAUTHORIZED");
}
