# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Ayam Geprek Sambel Ijo Al-Fariz

---

### Informasi Dokumen

| Atribut | Keterangan |
| :--- | :--- |
| **Nama Proyek** | Website Resmi & Simulasi Pemesanan Ayam Geprek Sambel Ijo Al-Fariz |
| **Versi Dokumen** | 1.0.0 (Enterprise Production-Ready) |
| **Status Dokumen** | Disetujui berdasarkan Analisis Kode Sumber & Spesifikasi Desain |
| **Entitas Usaha** | UMKM Kuliner Ayam Geprek Sambel Ijo Al-Fariz |
| **Lokasi Operasional** | Jl. Surya Kencana No. 27, Pamulang Barat (Depan Kampus Utama UNPAM), Tangerang Selatan |
| **Kontak Resmi** | WhatsApp: +62 897-3816-530 |
| **Dokumen Acuan** | `DESIGN (1).md`, `metadata.json`, `package.json`, `src/App.tsx` |

---

## 1. Executive Summary & Ringkasan Proyek

### 1.1 Latar Belakang & Deskripsi Produk

Ayam Geprek Sambel Ijo Al-Fariz merupakan aplikasi web modern berorientasi *craving-driven Indonesian culinary discovery and ordering simulation*. Aplikasi ini dirancang khusus untuk memfasilitasi pelanggan (mahasiswa Universitas Pamulang, tenaga pendidik, dan masyarakat sekitar Pamulang) dalam mengeksplorasi hidangan otentik ayam goreng tepung krispi dengan balutan ulegan sambel ijo dadakan, mengonfigurasi porsi secara kustom, melakukan simulasi pembayaran digital, serta meneruskan pesanan resmi secara instan ke gerobak fisik melalui WhatsApp API.

### 1.2 Tujuan Bisnis (Business Objectives)

1. **Digitalisasi Pemesanan Warung Gerobak:** Mengurangi antrean fisik di jam sibuk perkuliahan (15.00 – 22.00 WIB) melalui mekanisme peracikan pesanan mandiri (*self-service custom order*).
2. **Standardisasi Format Pesanan WhatsApp:** Menghilangkan ambiguitas pesanan teks biasa dengan format terstruktur otomatis (menu, level pedas, cara penyajian sambal, add-ons, catatan, subtotal, PPN 11%, dan ID transaksi).
3. **Pemberdayaan Pelanggan Berbasis AI:** Menyediakan asisten kuliner cerdas berbasis Google Gemini untuk konsultasi nutrisi/anggaran, navigasi rute kampus dengan Google Maps Grounding, serta visualisasi foto makanan beresolusi tinggi.

### 1.3 Target Pengguna

- **Mahasiswa & Dosen Kampus Utama UNPAM:** Pengguna harian dengan kebutuhan makan cepat, harga terjangkau (Rp 15.000 – Rp 17.000), dan porsi mengenyangkan.
- **Warga Lokal Pamulang Permai & Komuter:** Pelanggan santap malam dan *take-away*.
- **Panitia Himpunan/Acara Kampus:** Pemesan partai besar (*catering/order box*).

---

## 2. Arsitektur Sistem & Spesifikasi Teknologi (Tech Stack)

Berdasarkan berkas konfigurasi `package.json` dan implementasi kode, arsitektur teknologi yang digunakan adalah sebagai berikut:

### 2.1 Arsitektur Frontend

- **Framework & Runtime:** React 19 (`react: ^19.0.1`, `react-dom: ^19.0.1`)
- **Bahasa Pemrograman:** TypeScript (`typescript: ^7.0.2`)
- **Build Tool & Bundler:** Vite 8 (`vite: ^8.3.0`, `@vitejs/plugin-react: ^6.1.1`)
- **Styling Engine:** Tailwind CSS v4 (`tailwindcss: ^4.3.3`, `@tailwindcss/vite: ^4.3.3`, `autoprefixer: ^10.4.21`)
- **Ikonografi:** Lucide React (`lucide-react: ^0.546.0`)
- **Animasi:** Motion (`motion: ^12.23.24`)

### 2.2 Arsitektur Backend & Middleware

- **Server Framework:** Express.js 4 (`express: ^4.21.2`, `@types/express: ^4.17.21`)
- **Runtime Runner:** tsx (`tsx: ^4.21.0`), Node.js (`@types/node: ^22.14.0`)
- **Konfigurasi Lingkungan:** dotenv (`dotenv: ^17.2.3`)
- **API Handler:** `src/server/apiHandler.ts` untuk melayani rute `/api/gemini/*`

### 2.3 Layanan Kecerdasan Buatan (AI & Generative Services)

- **SDK:** Google Gen AI SDK (`@google/genai: ^2.4.0`)
- **Model Asisten & Grounding:** `gemini-3.8-flash`
  - Fitur Advisor Kuliner (Personalisasi Mas Al-Fariz & deep thinking)
  - Google Maps Grounding Tool (`tools: [{ googleMaps: {} }]`)
  - Google Search Grounding Tool (`tools: [{ googleSearch: {} }]`)
- **Model Studio Gambar:** `gemini-3.1-flash-lite-image`
  - Generator visual makanan rasio 1:1 resolusi 1K/2K/4K

### 2.4 Lapisan Penyimpanan Data (Data Persistence)

- **Database Server:** Belum ditentukan pada requirement.
- **Client-Side Storage (Aktif):** Web Storage API (`localStorage`)
  - Identitas Pengguna: `alfariz_user_name`
  - Riwayat & Tracker Pesanan: `alfariz_custom_geprek_orders_v1`
  - Ulasan Kustom: `alfariz_custom_reviews`

### 2.5 Integrasi Pihak Ketiga

- **WhatsApp Direct API:** URL scheme `https://wa.me/628973816530?text={encoded_message}`
- **Peta Interaktif:** Google Maps Embed iframe & External Direction Link

---

## 3. Desain Sistem & Panduan Estetika (Design System)

Mengacu langsung pada spesifikasi `DESIGN (1).md`:

### 3.1 Arah Desain (Neo-Brutalist Street-Food Style)

Mengadopsi energi *street-food neo-brutalism* dengan garis batas kontras tinggi (*hard ink-black borders*), bayangan tajam tanpa blur (*hard offset drop-shadows*), layout poster terstruktur, serta sudut tajam 0px (*sharp orthogonal edges*).

### 3.2 Token Palet Warna

| Token Name | Hex Code | Peruntukan Fungsional |
| :--- | :--- | :--- |
| `primary` | `#a43700` / `#781519` | Penegasan brand, kontainer utama, badge header |
| `secondary` | `#2a6b2c` / `#2E7D32` | Sambel ijo otentik, status herbal segar, indikator sehat |
| `tertiary` / `crispy-crust` | `#F5C518` / `#F57C00` | Golden crust, aksen tombol sekunder, highlight bintang |
| `surface` / `ivory-bg` | `#FDFBF7` / `#f8f9ff` | Kanvas latar belakang warung, pengganti putih steril |
| `ink-black` | `#111827` | Garis tepi kontras tinggi (2px-3px), bayangan brutalist, teks utama |
| `whatsapp` | `#25D366` | Tombol dan aksi pesan cepat WhatsApp |

### 3.3 Tipografi

- **Headlines / Judul Utama:** *Bricolage Grotesque* (Weight 700 - 800, tight letter-spacing, street chalkboard/banner style).
- **Body & Tactical Labels:** *Space Grotesk* (Weight 400 - 700, mono-adjacent cadence untuk harga, takaran cabai, dan koordinat alamat).

### 3.4 Aturan Elevasi, Border, & Bentuk

1. **Sudut (Radius):** Mutlak `0px` radius pada elemen brutalist; pada varian kartu interaktif menggunakan rounded-2xl/3xl yang dibingkai border kontras.
2. **Bayangan (Shadow):** Hard offset ink shadow tanpa blur (e.g. `box-shadow: 4px 4px 0px #111827`).
3. **Depress Feedback:** Translasi `+2px X` dan `+2px Y` dengan kolaps bayangan saat elemen diklik/ditekan.

---

## 4. Struktur Antarmuka & Peta Halaman (UI Layout Map)

Website dirancang sebagai *Single Page Application (SPA)* responsif yang terbagi atas bagian-bagian berikut:

```text
[Sticky Header (Branding, Navigasi Anchor, Login Status, WhatsApp CTA)]
       │
[1. Hero Section (Watermark, Platter Cobek Batu 3D, Badge Buka/Lokasi, CTA)]
       │
[2. Welcome Strip (Ticker Info & Suasana Warung)]
       │
[3. Tentang Kami Section (Kisah Mas Al-Fariz, Badge UMKM, Seal Keaslian)]
       │
[4. Cita Rasa Banner (Banner Gradien Kuning Keunggulan Rasa Otentik)]
       │
[5. Keunggulan Section (Grid 4 Pilar: Murah, Lezat, Fresh, Mudah Dipesan)]
       │
[6. Promo Tagline Banner ("Siang-Malam Enaknya Geprek Al-Fariz!")]
       │
[7. Menu Section (Katalog Menu Juara Sambel Ijo dengan Scroll-to-Order)]
       │
[8. Layanan Kami (4 Moda Layanan: Ambil, Makan di Tempat, Bungkus, Delivery)]
       │
[9. Simulasi Pemesanan & Order Generator (Kalkulator, Add-ons, Billing, WA)]
       │
[10. Testimoni Pelanggan (Slider Review, Filter UNPAM/Warga, Form Ulasan Baru)]
       │
[11. Lokasi & Kontak Section (Peta Interaktif, Jam Buka, Detail Alamat UNPAM)]
       │
[Footer (Identitas Brand, Link Cepat, Menu Favorit, Hak Cipta @oddycosplay 2027)]
       │
[Floating Quick Actions (Tombol Asisten AI & Studio Gambar Makanan)]
```

---

## 5. Kebutuhan Fungsional (Functional Requirements)

### FR-01: Autentikasi & Profil Pengguna Sederhana

- **Deskripsi:** Mengidentifikasi nama pelanggan untuk personalisasi pesanan tanpa memerlukan alur registrasi password yang rumit.
- **Komponen:** `LoginModal.tsx`, `Header.tsx`.
- **Aturan Bisnis & Flow:**
  - Pengguna memasukkan nama lengkap/panggilan.
  - Data nama disimpan pada `localStorage` dengan key `alfariz_user_name`.
  - Header menampilkan ikon akun dan nama pemesan terverifikasi.
  - Nama pemesan otomatis mengisi field `customerName` pada form simulasi pemesanan.
  - Pengguna dapat melakukan *Logout*, yang menghapus record nama dari `localStorage`.

### FR-02: Katalog Menu & Navigasi Pemesanan Cepat

- **Deskripsi:** Menyajikan daftar menu utama warung dengan rincian harga, deskripsi bahan, badge, dan trigger pemilihan porsi.
- **Komponen:** `MenuSection.tsx`, `data/menuData.ts`.
- **Daftar Menu Tersedia:**
  1. `Paket Geprek + Nasi` (Rp 17.000, Best Seller): Ayam krispi fillet geprek sambel ijo dadakan + Nasi putih pulen hangat + Lalapan timun segar.
  2. `Ayam Geprek Saja` (Rp 15.000, Alacarte): 1 potong ayam krispi jumbo berbalut sambel ijo cabai rawit pedas gurih tanpa nasi + lalapan.
- **Aturan Flow:**
  - Mengklik kartu menu atau tombol "Racik Porsi & Pesan Sekarang" otomatis memperbarui state `selectedMenuItem` dan melakukan *smooth scroll* ke komponen `#simulasi-pemesanan`.

### FR-03: Kalkulator Simulasi Pemesanan Kustom (Core Engine)

- **Deskripsi:** Mesin peracik porsi yang menghitung komponen harga, tingkat kepedasan, dan preferensi penyajian secara *real-time*.
- **Komponen:** `SimulasiPemesanan.tsx`.
- **Parameter Input:**
  - **Menu Dipilih:** Radio/Selector antara paket atau alacarte.
  - **Level Pedas:** Skala angka 1 sampai 5.
    - Level 1: Sedang (~20k SHU)
    - Level 2: Pedas Mantap (~40k SHU)
    - Level 3: Pedas Nampol (~70k SHU)
    - Level 4: Pedas Gila (~100k SHU)
    - Level 5: Pedas Mampus (120k+ SHU)
  - **Penyajian Sambal:** `dicampur` (di atas ayam), `dipisah` (wadah cup), atau `tanpa_sambal`.
  - **Jumlah Porsi:** Counter numerik (minimum 1 porsi).
  - **Pilihan Tambahan (Add-ons):**
    - Extra Sambel Rawit (+Rp 3.000 per porsi)
    - Tambah Nasi Pulen (+Rp 5.000 per porsi)
  - **Metode Pengambilan:** Tetap pada `ambil_gerobak` ("Ambil di Gerobak Depan UNPAM").
  - **Nama Pemesan & Catatan Khusus:** Input teks bebas untuk instruksi khusus pelanggan.
- **Formula Kalkulasi Finansial:**
  $$\text{Base Total} = \text{Harga Menu} \times \text{Porsi}$$
  $$\text{Extra Sambel} = (\text{addons.extraSambel} ? 3000 : 0) \times \text{Porsi}$$
  $$\text{Tambah Nasi} = (\text{addons.tambahNasi} ? 5000 : 0) \times \text{Porsi}$$
  $$\text{Subtotal} = \text{Base Total} + \text{Extra Sambel} + \text{Tambah Nasi}$$
  $$\text{PPN (11\%)} = \text{Math.round}(\text{Subtotal} \times 0.11)$$
  $$\text{Grand Total} = \text{Subtotal} + \text{PPN}$$

### FR-04: Simulasi Pembayaran Digital & Struk Resmi

- **Deskripsi:** Modal interaktif untuk menyimulasikan pengalaman transaksi perbankan dan e-wallet nasional Indonesia.
- **Komponen:** `DigitalPaymentModal.tsx`.
- **Kanal Pembayaran Tersedia:**
  - **QRIS:** Generator QR code standar nasional dengan batas waktu pembayaran (*countdown timer* 15 menit).
  - **E-Wallet:** GoPay, OVO, DANA, ShopeePay (termasuk fitur salin nomor akun & petunjuk bayar).
  - **Virtual Account (VA):** Bank BCA, Mandiri, BRI, SeaBank (dengan nomor VA dinamis dan tombol salin).
  - **Tunai / Cash:** Bayar di gerobak saat pengambilan.
- **Status Transaksi:**
  - Tombol "Saya Sudah Bayar (Simulasi Lunas)" memverifikasi status pembayaran.
  - Sistem membuat `txId` unik berformat `TX-FARIZ-{RANDOM_6_DIGIT}`.
  - Menampilkan struk digital (*Digital Receipt*) lengkap dengan ringkasan rincian biaya, waktu bayar, dan tombol cetak/unduh.

### FR-05: Pelacak & Riwayat Pesanan Lokal (Order History)

- **Deskripsi:** Penyimpanan jejak transaksi lokal pelanggan di browser.
- **Komponen:** `SimulasiPemesanan.tsx`.
- **Fitur:**
  - Tab pengalihan antara "Kalkulator Pesanan" dan "Riwayat Pesanan ({N})".
  - Penyimpanan pesanan baru ke `localStorage` (`alfariz_custom_geprek_orders_v1`).
  - Menampilkan status badge pesanan: `Lunas (Simulasi)` atau `Bayar di Tempat`.
  - Tombol "Buka Struk Digital" untuk pesanan historis.
  - Tombol "Hapus Riwayat" (tunggal atau seluruhnya).

### FR-06: Generator Pesanan WhatsApp Otomatis

- **Deskripsi:** Mengubah seluruh konfigurasi pesanan menjadi pesan teks terstruktur yang diarahkan langsung ke nomor admin gerobak.
- **Nomor Tujuan:** `+628973816530` (`https://wa.me/628973816530`)

**Format Teks Terstandarisasi:**

```text
Halo Admin Ayam Geprek Al-Fariz UNPAM!

[PEMBAYARAN LUNAS TERVERIFIKASI] ✅ (jika lunas)
Metode: {Metode Pembayaran}
Ref ID: {txId}

Saya mau pesan kustom:
• {Porsi}x {Nama Menu} (Rp {Total Menu})
  - Sambal: {Dicampur di atas ayam / Dipisah di wadah cup / Tanpa Sambal}
• {Porsi}x Extra Sambel (+Rp {Total Sambel}) (jika dipilih)
• {Porsi}x Tambah Nasi Pulen (+Rp {Total Nasi}) (jika dipilih)

Subtotal: Rp {Subtotal}
PPN (11%): Rp {PPN}
TOTAL PEMBAYARAN: Rp {Grand Total}

Metode Pengambilan: Ambil di Gerobak Depan UNPAM
Nama Pemesan: {customerName}
Catatan Khusus: {notes}
Status Pembayaran: {SUDAH LUNAS / Bayar saat ambil}

Mohon konfirmasi dan segera diproses ya! Terima kasih 🙏
```

### FR-07: Testimoni & Manajemen Ulasan Pelanggan

- **Deskripsi:** Menampilkan bukti sosial (*social proof*) dan memungkinkan pelanggan menulis ulasan langsung.
- **Komponen:** `TestimoniSection.tsx`.
- **Fitur:**
  - Slider kartu review testimoni bawaan (Dimas P., Ibu Sari, Reza Kurnia, Nadia A., Bima Sakti).
  - Filter kategori ulasan:
    - `all`: Semua ulasan.
    - `rating5`: Ulasan bintang 5.
    - `campus`: Ulasan dari segmen mahasiswa, dosen, panitia UNPAM.
    - `locals`: Ulasan warga sekitar Pamulang, alumni, dan ojol.
  - Modal "Tulis Ulasan Baru": Form input nama, peran/afiliasi, rating bintang interaktif (1-5), tag sorotan, menu favorit, serta isi ulasan.
  - Persistensi ulasan baru di `localStorage` (`alfariz_custom_reviews`).

### FR-08: Asisten Menu AI & Grounding Maps/Search

- **Deskripsi:** Konsultan kuliner berbasis Gemini 3.8 Flash untuk rekomendasi hidangan dan navigasi lokasi gerobak.
- **Komponen:** `AiAdvisorModal.tsx`, `server/apiHandler.ts`.
- **Mode Operasional:**
  1. **Advisor Menu & Meal Planning:**
     - Menerima pertanyaan pengguna terkait rekomendasi menu, budget mahasiswa, atau level pedas.
     - Didukung opsi *Deep Thinking* untuk analisis kecukupan kalori dan estimasi toleransi capsaicin (SHU).
     - Fallback offline: Menyajikan rekomendasi paket hemat Rp 20.000 jika API key tidak tersedia.
  2. **Maps Grounding:**
     - Memberikan panduan navigasi menuju titik Jl. Surya Kencana No. 27 Pamulang Barat dengan koordinat lintang `-6.3456`, bujur `106.7412`.
     - Menghasilkan tautan Google Maps tervalidasi.
  3. **Search Grounding:**
     - Menyajikan informasi tren kuliner seputar kampus UNPAM bersumber dari pencarian Google terkini.

### FR-09: Studio Gambar Kuliner AI

- **Deskripsi:** Pembuat visual fotografi kuliner ayam geprek berkualitas tinggi untuk materi promosi atau display.
- **Komponen:** `ImageStudioModal.tsx`, `server/apiHandler.ts`.
- **Fitur:**
  - Input prompt kustom atau pilihan rekomendasi bawaan.
  - Pilihan output resolusi: 1K (1024x1024), 2K (2048x2048), atau 4K (4096x4096).
  - Preview visual gambar dan tombol unduh/simpan gambar.
  - Fallback offline: Menggunakan curated image showcase bersolusi tinggi dari CDN Google Storage.

### FR-10: Peta Interaktif & Petunjuk Arah

- **Deskripsi:** Komponen penyaji lokasi fisik warung secara visual dan interaktif.
- **Komponen:** `LokasiKontakSection.tsx`.
- **Fitur:**
  - Embed iframe Google Maps titik Universitas Pamulang.
  - Petunjuk patokan fisik: Depan gerbang utama UNPAM, samping Mie Ayam, dekat minimarket Lawson.
  - Jam buka terverifikasi: 15.00 – 22.00 WIB setiap hari.
  - Tautan langsung pembuka aplikasi Google Maps eksternal.

---

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### NFR-01: Performa & Efisiensi Pemuatan

- Waktu *First Contentful Paint (FCP)* di bawah 1.5 detik pada jaringan 4G.
- Dukungan *lazy-loading* pada aset gambar porsi dan backdrop.
- Ukuran bundle JavaScript dioptimalkan menggunakan Vite & tree-shaking ES Modules.

### NFR-02: Keamanan & Sanitasi Data (Security)

- `GEMINI_API_KEY` diisolasi pada lingkungan server (`process.env.GEMINI_API_KEY`) dan tidak diekspos langsung ke bundle frontend klien.
- Sanitasi input nama dan catatan pemesanan sebelum di-encode ke parameter URL WhatsApp (`encodeURIComponent`) guna mencegah injeksi URL.
- Tidak menyimpan data finansial kartu kredit sensitif pada browser klien.

### NFR-03: Ketersediaan & Mekanisme Cadangan (Reliability & Fallback)

- Seluruh endpoint AI (`/api/gemini/*`) wajib memiliki skema *graceful fallback* respons lokal statis sehingga jika kuota habis, rate limit, atau jaringan terputus, aplikasi tetap berjalan normal tanpa error layar putih.

### NFR-04: Aksesibilitas & Responsivitas (A11y & Mobile First)

- Mengutamakan navigasi satu jempol (*single-thumb navigation*) pada perangkat mobile (`viewport < 768px`).
- Memenuhi standar rasio kontras warna WCAG AA untuk teks di atas background maroon (`#781519`) dan emas (`#F5C518`).
- Tombol interaktif memiliki area sentuh minimum 44 x 44 piksel.

---

## 7. Model Data & Skema Kontrak TypeScript

Struktur tipe data utama yang didefinisikan pada `src/types.ts` dan komponen terkait:

### 7.1 Interface `MenuItem`

```typescript
export interface MenuItem {
  id: string;
  name: string;
  category: 'paket' | 'alacarte' | 'pelengkap' | 'minuman';
  price: number;
  description: string;
  image: string;
  badge?: string;
  spiceLevelSupported?: boolean;
}
```

### 7.2 Interface `OrderItem`

```typescript
export interface OrderItem {
  menuItem: MenuItem;
  spiceLevel: number;
  sambalServing: 'dicampur' | 'dipisah' | 'tanpa_sambal';
  portion: number;
  addons: {
    extraSambel: boolean;
    tambahNasi: boolean;
    esTehJumbo?: boolean;
    tahuTempe?: boolean;
  };
  customerName: string;
  pickupMethod: 'ambil_gerobak';
  notes: string;
}
```

### 7.3 Interface `SavedOrderRecord`

```typescript
export interface SavedOrderRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  menuItem: MenuItem;
  portion: number;
  spiceLevel: number;
  sambalServing: 'dicampur' | 'dipisah' | 'tanpa_sambal';
  addons: {
    extraSambel: boolean;
    tambahNasi: boolean;
    esTehJumbo?: boolean;
    tahuTempe?: boolean;
  };
  pickupMethod: string;
  customerName: string;
  notes: string;
  subtotal: number;
  ppn: number;
  grandTotal: number;
  paymentMethod?: string;
  paymentStatus?: 'lunas_simulasi' | 'bayar_di_tempat';
  txId?: string;
}
```

### 7.4 Interface `Testimonial`

```typescript
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  highlightTag?: string;
  favoriteMenu?: string;
  date?: string;
  avatarColor?: string;
}
```

---

## 8. Spesifikasi Kontrak API (API Specifications)

Endpoint internal yang ditangani oleh `src/server/apiHandler.ts`:

### 8.1 Rekomendasi Menu & Konsultan AI

**Rute:** `POST /api/gemini/advisor`

**Request Body:**

```json
{
  "prompt": "Rekomendasikan paket hemat untuk mahasiswa budget Rp 20.000",
  "deepThinking": false
}
```

**Response Berhasil (200 OK):**

```json
{
  "success": true,
  "advice": "💡 Rekomendasi Terbaik: Paket Geprek + Nasi (Rp 17.000)...",
  "thinkingNotes": null,
  "source": "gemini-advisor"
}
```

### 8.2 Google Maps Grounding

**Rute:** `POST /api/gemini/grounding-maps`

**Request Body:**

```json
{
  "query": "Panduan rute jalan ke Ayam Geprek Al-Fariz depan Kampus UNPAM"
}
```

**Response Berhasil (200 OK):**

```json
{
  "success": true,
  "text": "Ayam Geprek Sambel Ijo Al-Fariz berlokasi sangat strategis di Jl. Surya Kencana No. 27...",
  "mapsLinks": [
    {
      "title": "Gerbang Utama Universitas Pamulang (UNPAM)",
      "uri": "https://maps.google.com/?q=Universitas+Pamulang+Jl.+Surya+Kencana+No.27+Pamulang+Barat"
    }
  ],
  "source": "gemini-maps-grounding"
}
```

### 8.3 Google Search Grounding

**Rute:** `POST /api/gemini/grounding-search`

**Request Body:**

```json
{
  "query": "Kuliner ayam geprek sambel ijo kampus UNPAM Pamulang tren mahasiswa"
}
```

**Response Berhasil (200 OK):**

```json
{
  "success": true,
  "text": "Ayam Geprek Sambel Ijo adalah salah satu kuliner favorit mahasiswa...",
  "citations": [
    {
      "title": "Kuliner Populer Seputar Kampus UNPAM Pamulang",
      "uri": "https://unpam.ac.id"
    }
  ],
  "source": "gemini-search-grounding"
}
```

### 8.4 Studio Gambar Kuliner AI

**Rute:** `POST /api/gemini/generate-image`

**Request Body:**

```json
{
  "prompt": "Paket Ayam Geprek Sambel Ijo uleg dadakan di cobek batu panas...",
  "imageSize": "1K"
}
```

**Response Berhasil (200 OK):**

```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,...",
  "resolution": "1K",
  "source": "gemini-generated"
}
```

---

## 9. Diagram Alur Kerja Sistem (System Workflows)

### 9.1 Alur Simulasi Pemesanan & Forward WhatsApp

```text
Pelanggan
   │
   ▼
Pilih Menu dari Katalog (Paket / Alacarte)
   │
   ▼
Konfigurasi: Level Pedas (1-5), Sambal (Campur/Pisah), Porsi, Add-ons (Nasi/Sambal)
   │
   ▼
Sistem Menghitung Otomatis: Subtotal, PPN (11%), Grand Total
   │
   ├─────────────────────────────────────────┐
   ▼                                         ▼
Pilih "Bayar di Tempat"             Pilih "Bayar Digital (QRIS/E-Wallet/VA)"
   │                                         │
   │                                         ▼
   │                                Modal Pembayaran Terbuka (Countdown 15m)
   │                                         │
   │                                         ▼
   │                                Klik "Saya Sudah Bayar (Simulasi Lunas)"
   │                                         │
   │                                         ▼
   │                                Sistem Membuat Ref ID: TX-FARIZ-xxxxxx
   │                                         │
   └────────────────────┬────────────────────┘
                        ▼
           Simpan ke Riwayat Lokal (localStorage)
                        ▼
           Klik "Kirim Pesanan ke WhatsApp"
                        ▼
    WhatsApp Terbuka dengan Teks Pesanan Terstruktur
                        ▼
   Admin Warung Menerima & Memproses Pesanan Fisik
```

---

## 10. Batasan Sistem & Rincian di Luar Ruang Lingkup (Out of Scope)

Sesuai aturan ketat proyek, komponen berikut **tidak diadakan atau belum ditentukan pada requirement saat ini**:

1. **Basis Data Server Terpusat:** Belum ditentukan pada requirement. (Saat ini persistensi mengandalkan `localStorage` per peramban).
2. **Payment Gateway Nyata (Production Midtrans/Xendit):** Belum ditentukan pada requirement. (Saat ini menggunakan modul simulasi interaktif `DigitalPaymentModal`).
3. **Autentikasi Multi-User dengan Password/OAuth/JWT:** Belum ditentukan pada requirement. (Saat ini menggunakan model penyimpanan nama profil berbasis `localStorage`).
4. **Live GPS Driver Fleet Tracking:** Belum ditentukan pada requirement. (Layanan antar dilakukan melalui koordinasi kurir manual WhatsApp).
5. **Panel Admin Multi-Role (Superadmin / Kasir Backend):** Belum ditentukan pada requirement.
