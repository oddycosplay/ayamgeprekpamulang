import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Field, Toggle, inputCls } from "../ui.tsx";
import { api } from "../api.ts";
import type { Settings } from "../types.ts";


export function SettingsPage() {
  const qc = useQueryClient();
  const settings = useQuery({ queryKey: ["settings"], queryFn: api.settings });
  const [s, setS] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (settings.data) setS(settings.data);
  }, [settings.data]);
  useEffect(() => setOrigin(window.location.origin), []);

  async function save(next: Settings, message = "Pengaturan disimpan") {
    setBusy(true);
    try {
      await api.saveSettings(next);
      toast.success(message);
      void qc.invalidateQueries({ queryKey: ["settings"] });
    } catch (e) {
      toast.error(e instanceof Error && e.message.includes("WhatsApp") ? "Nomor WhatsApp hanya angka, contoh 628123456789" : "Gagal menyimpan");
    } finally {
      setBusy(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (s) void save(s);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-ijo">Atur warung</p>
      <h1 className="mt-1 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">Pengaturan</h1>

      {!s ? (
        <p className="mt-8 text-sm text-ink-soft">Memuat...</p>
      ) : (
        <>
          {/* Open / closed switch: the one control the owner touches daily */}
          <section
            className={`mt-8 flex items-center justify-between gap-4 rounded-[2rem] p-6 transition-colors ${s.accepting_orders ? "bg-ijo text-white" : "bg-ink text-ivory"}`}
          >
            <div>
              <p className="font-display text-2xl font-extrabold">{s.accepting_orders ? "Warung BUKA" : "Warung TUTUP"}</p>
              <p className="mt-1 text-sm opacity-80">
                {s.accepting_orders
                  ? "Website pelanggan menerima pesanan."
                  : "Pesanan baru dari website ditolak sampai kamu buka lagi."}
              </p>
            </div>
            <Toggle
              checked={s.accepting_orders}
              label="Terima pesanan"
              onChange={(v) => {
                const next = { ...s, accepting_orders: v };
                setS(next);
                void save(next, v ? "Warung dibuka" : "Warung ditutup");
              }}
            />
          </section>

          <form onSubmit={submit} className="mt-6 space-y-5 rounded-[2rem] border-2 border-ink bg-white p-6">
            <Field label="Nama warung">
              <input required maxLength={80} value={s.store_name} onChange={(e) => setS({ ...s, store_name: e.target.value })} className={inputCls} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nomor WhatsApp warung" hint="Format 62xxxxxxxxxx">
                <input
                  required
                  inputMode="numeric"
                  value={s.whatsapp}
                  onChange={(e) => setS({ ...s, whatsapp: e.target.value.replace(/\D/g, "") })}
                  className={`${inputCls} af-num`}
                />
              </Field>
              <Field label="PPN (%)" hint="Isi 0 jika tidak memungut PPN">
                <input
                  type="number"
                  min={0}
                  max={50}
                  step="0.5"
                  value={s.tax_percent}
                  onChange={(e) => setS({ ...s, tax_percent: Number(e.target.value) || 0 })}
                  className={`${inputCls} af-num`}
                />
              </Field>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-2xl bg-maroon px-6 py-3 text-sm font-extrabold text-ivory hover:bg-maroon-deep disabled:opacity-60"
            >
              {busy ? "Menyimpan..." : "Simpan pengaturan"}
            </button>
          </form>

          <section className="mt-6 rounded-[2rem] bg-paper p-6">
            <h2 className="font-display text-xl font-extrabold">Sambungan ke website pelanggan</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Website pemesanan Al-Fariz memakai alamat ini untuk mengambil harga terbaru dan mengirim pesanan masuk.
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Daftar menu & harga", `${origin}/api/public/menu`],
                ["Kirim pesanan", `${origin}/api/public/orders`],
                ["Halaman lacak pelanggan", `${origin}/lacak/KODE`],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-bold uppercase tracking-wider text-ink-soft">{k}</dt>
                  <dd className="af-num mt-0.5 break-all rounded-lg bg-ivory px-3 py-2 text-xs font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      )}
    </div>
  );
}
