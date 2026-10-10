import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { EmptyState, Field, Sheet, Toggle, inputCls } from "../ui.tsx";
import { api } from "../api.ts";
import { CATEGORIES, categoryLabel, rupiah, type Category, type Product } from "../types.ts";


type Draft = Omit<Product, "updated_at" | "id"> & { id?: string };

const EMPTY: Draft = {
  name: "",
  category: "alacarte",
  price: 15000,
  description: "",
  image_url: "",
  badge: "",
  spice_supported: 1,
  is_active: 1,
  sort_order: 20,
};

export function ProductsPage() {
  const qc = useQueryClient();
  const products = useQuery({ queryKey: ["products"], queryFn: api.products });
  const [editing, setEditing] = useState<Draft | null>(null);
  const [filter, setFilter] = useState<"semua" | Category>("semua");

  const refresh = () => void qc.invalidateQueries({ queryKey: ["products"] });
  const toggle = useMutation({
    mutationFn: (v: { id: string; active: boolean }) => api.toggleProduct(v.id, v.active),
    onSuccess: (_r, v) => {
      toast.success(v.active ? "Menu ditampilkan di website" : "Menu disembunyikan (habis)");
      refresh();
    },
  });

  const list = (products.data ?? []).filter((p) => filter === "semua" || p.category === filter);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ijo">Etalase gerobak</p>
          <h1 className="mt-1 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">Menu & Harga</h1>
          <p className="mt-2 max-w-lg text-sm text-ink-soft">
            Klik harga untuk ubah cepat. Perubahan langsung dipakai di website pelanggan.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex items-center gap-2 rounded-2xl bg-ijo px-5 py-3 text-sm font-extrabold text-white shadow-[0_4px_0_0_#1b5e20] transition-all hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#1b5e20]"
        >
          + Tambah menu
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[{ value: "semua", label: "Semua" } as const, ...CATEGORIES].map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold ${filter === c.value ? "border-ink bg-ink text-ivory" : "border-line bg-white text-ink-soft hover:border-ink"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {products.data && list.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Belum ada menu di sini" body="Tambah menu baru dengan tombol hijau di atas." />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <article
              key={p.id}
              className={`group flex flex-col overflow-hidden rounded-[1.75rem] border-2 bg-white transition-all ${p.is_active ? "border-ink" : "border-line opacity-70"}`}
            >
              <div className="relative aspect-[16/10] bg-paper">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center">
                    <span className="font-display text-5xl font-extrabold text-maroon/15">{p.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
                {p.badge ? (
                  <span className="absolute left-3 top-3 -rotate-2 rounded-lg bg-kuning px-2.5 py-1 text-[11px] font-extrabold text-maroon-deep shadow">
                    {p.badge}
                  </span>
                ) : null}
                {!p.is_active ? (
                  <span className="absolute inset-0 grid place-items-center bg-ink/50 font-display text-2xl font-extrabold text-ivory">HABIS</span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ijo">{categoryLabel(p.category)}</p>
                    <h2 className="truncate font-display text-lg font-extrabold leading-tight">{p.name}</h2>
                  </div>
                  <Toggle checked={!!p.is_active} label={`Tampilkan ${p.name}`} onChange={(v) => toggle.mutate({ id: p.id, active: v })} />
                </div>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-ink-soft">{p.description}</p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <QuickPrice product={p} onSaved={refresh} />
                  <button
                    onClick={() => setEditing({ ...p })}
                    className="rounded-full px-3 py-1.5 text-sm font-bold text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                  >
                    Ubah detail
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ProductSheet draft={editing} onClose={() => setEditing(null)} onSaved={refresh} />
    </div>
  );
}

// Click the price, type, press Enter.
function QuickPrice({ product, onSaved }: { product: Product; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(product.price));
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editing) ref.current?.select();
  }, [editing]);

  async function commit() {
    const price = Math.round(Number(value.replace(/\D/g, "")));
    setEditing(false);
    if (!Number.isFinite(price) || price === product.price) return;
    try {
      await api.saveProduct({ ...product, price });
      toast.success(`${product.name} sekarang ${rupiah(price)}`);
      onSaved();
    } catch {
      toast.error("Gagal menyimpan harga");
      setValue(String(product.price));
    }
  }

  if (editing) {
    return (
      <div className="flex items-center rounded-xl border-2 border-ijo bg-white pl-3">
        <span className="text-sm font-bold text-ink-soft">Rp</span>
        <input
          ref={ref}
          inputMode="numeric"
          aria-label={`Harga ${product.name}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") void commit();
            if (e.key === "Escape") {
              setValue(String(product.price));
              setEditing(false);
            }
          }}
          className="af-num w-24 bg-transparent px-2 py-1.5 text-lg font-bold focus:outline-none"
        />
      </div>
    );
  }
  return (
    <button
      onClick={() => {
        setValue(String(product.price));
        setEditing(true);
      }}
      title="Klik untuk ubah harga"
      className="af-num rounded-xl border-2 border-dashed border-transparent px-2 py-1 text-xl font-bold text-maroon transition-colors hover:border-kuning hover:bg-kuning-soft"
    >
      {rupiah(product.price)}
    </button>
  );
}

function ProductSheet({ draft, onClose, onSaved }: { draft: Draft | null; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    if (draft) setD(draft);
  }, [draft]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  async function upload(file: File) {
    setUploading(true);
    try {
      const json = await api.upload(file);
      set("image_url", json.url);
      toast.success("Foto terunggah");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.saveProduct(d);
      toast.success(d.id ? "Menu diperbarui" : "Menu baru ditambahkan");
      onSaved();
      onClose();
    } catch {
      toast.error("Gagal menyimpan. Periksa isian lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function destroy() {
    if (!d.id) return;
    if (!window.confirm(`Hapus "${d.name}" permanen? Riwayat pesanan lama tetap aman.`)) return;
    try {
      await api.removeProduct(d.id);
      toast.success("Menu dihapus");
      onSaved();
      onClose();
    } catch {
      toast.error("Gagal menghapus");
    }
  }

  return (
    <Sheet open={!!draft} onClose={onClose} title={d.id ? "Ubah menu" : "Menu baru"}>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">Foto</span>
          <label className="relative block aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-line bg-paper hover:border-ijo">
            {d.image_url ? (
              <img src={d.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full place-items-center text-sm font-bold text-ink-soft">Klik untuk unggah foto (maks 4 MB)</span>
            )}
            {uploading ? <span className="absolute inset-0 grid place-items-center bg-ivory/80 text-sm font-bold">Mengunggah...</span> : null}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <Field label="Nama menu">
          <input required minLength={2} maxLength={80} value={d.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Harga (Rp)">
            <input
              required
              inputMode="numeric"
              value={d.price}
              onChange={(e) => set("price", Number(e.target.value.replace(/\D/g, "")) || 0)}
              className={`${inputCls} af-num text-lg font-bold`}
            />
          </Field>
          <Field label="Kategori">
            <select value={d.category} onChange={(e) => set("category", e.target.value as Category)} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Deskripsi">
          <textarea rows={3} maxLength={400} value={d.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Label" hint="Contoh: BEST SELLER, NEW">
            <input maxLength={20} value={d.badge} onChange={(e) => set("badge", e.target.value.toUpperCase())} className={inputCls} />
          </Field>
          <Field label="Urutan tampil" hint="Angka kecil tampil duluan">
            <input
              type="number"
              min={0}
              max={9999}
              value={d.sort_order}
              onChange={(e) => set("sort_order", Math.max(0, Number(e.target.value) || 0))}
              className={`${inputCls} af-num`}
            />
          </Field>
        </div>

        <div className="space-y-3 rounded-2xl bg-paper p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold">Bisa pilih level pedas</span>
            <Toggle checked={!!d.spice_supported} label="Level pedas" onChange={(v) => set("spice_supported", v ? 1 : 0)} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold">Tampil di website (stok ada)</span>
            <Toggle checked={!!d.is_active} label="Tampil di website" onChange={(v) => set("is_active", v ? 1 : 0)} />
          </div>
        </div>

        <button
          type="submit"
          disabled={busy || uploading}
          className="w-full rounded-2xl bg-ijo px-5 py-3.5 text-base font-extrabold text-white shadow-[0_5px_0_0_#1b5e20] transition-all hover:translate-y-[2px] hover:shadow-[0_3px_0_0_#1b5e20] disabled:opacity-60"
        >
          {busy ? "Menyimpan..." : "Simpan menu"}
        </button>
        {d.id ? (
          <button type="button" onClick={destroy} className="w-full py-2 text-sm font-bold text-cabai hover:underline">
            Hapus menu ini
          </button>
        ) : null}
      </form>
    </Sheet>
  );
}
