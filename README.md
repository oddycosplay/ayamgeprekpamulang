# Ayam Geprek Sambel Ijo Al-Fariz

![Preview Landing Page Ayam Geprek Sambel Ijo Al-Fariz](./laptop_beranda.png)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-%F0%9F%9A%80%20ayamsambelijopamulang.my.id-brightgreen?style=for-the-badge)](https://ayamsambelijopamulang.my.id)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/oddycosplay/ayamgeprekpamulang)
[![WhatsApp Order](https://img.shields.io/badge/WhatsApp-Order%2008973816530-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/628973816530)

![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## 🚀 Catatan Pembaruan Terkini (Release Notes v2.0.0)

Pembaruan besar versi **v2.0.0** difokuskan pada peningkatan performa ekstrem, optimasi SEO berstandar enterprise, kepatuhan aksesibilitas penuh (WCAG), serta integrasi standar web masa depan untuk Autonomous AI Agents:

| Audit Metrik | Skor Sebelumnya | Skor Rilis v2.0.0 | Keterangan |
| :--- | :---: | :---: | :--- |
| **Search Engine Optimization (SEO)** | 83 / 100 | **100 / 100** 🏆 | Struktur semantik utuh & bebas isu kanonikal |
| **Accessibility (Aksesibilitas)** | 86 / 100 | **100 / 100** 🏆 | Lulus audit ARIA & target sentuh tombol >= 40px |
| **Best Practices** | 89 / 100 | **100 / 100** 🏆 | Keamanan HTTPS, respons header, & rasio aspek |
| **Agentic Browsing (AI Discovery)** | Gagal / Error | **100 / 100** 🏆 | Validasi `llms.txt` & manifes ARD `ai-catalog.json` |
| **Server Response Time (TTFB)** | 1.348 ms | **~75 - 190 ms** ⚡ | Brotli compression & browser caching agresif |

### 🌟 Sorotan Perubahan di Versi 2.0.0

1. **Pre-rendered Semantic HTML untuk Web Crawlers**
   - Menambahkan struktur semantik HTML statis lengkap langsung di dalam `<div id="root">` pada `index.html` dan `bundle.html`. Bot mesin pencari (Googlebot, Bingbot) kini dapat langsung mengindeks teks H1, harga, jam buka, dan menu tanpa bergantung pada eksekusi JavaScript.
2. **Kepatuhan Aksesibilitas WCAG 2.2**
   - Memperbaiki pelanggaran atribut ARIA terlarang dengan menghapus `aria-label` dari kontainer bintang dan menggantinya dengan semantik `<span class="sr-only">`.
   - Mengoreksi urutan hierarki heading secara berurutan (`H1` ➔ `H2` ➔ `H3`).
   - Memperbesar touch target tombol pagination dot hingga 40×40px untuk kenyamanan pengguna mobile.
3. **Penerapan Standar Autonomous Agentic AI**
   - Penerapan berkas `public/llms.txt` sesuai format resmi [llmstxt.org](https://llmstxt.org/) yang memuat direktori tautan konten restoran.
   - Penerapan manifes `ai-catalog.json` dan `.well-known/ai-catalog.json` yang tervalidasi sesuai standar [Agentic Resource Discovery (ARD)](https://agenticresourcediscovery.org/spec/).
4. **Pembersihan AI-Slop & Redesain Fokus Konversi Pesanan**
   - Menghapus komponen chatbot yang tidak esensial untuk memangkas ukuran bundle JavaScript dan mempercepat First Contentful Paint (FCP).
   - Antarmuka disederhanakan: langsung fokus pada menu pilihan, simulasi racik porsi, dan pemesanan instan ke WhatsApp kasir.
5. **Optimasi Infrastruktur Hosting (DomaiNesia/cPanel)**
   - Peningkatan konfigurasi `.htaccess` dengan kompresi Brotli (`br`) dan Deflate/Gzip, MIME type detection otomatis untuk manifest JSON/Markdown, serta CORS headers yang aman.

---

## 🎓 Tugas Akhir & Profil Pengembang

Proyek ini merupakan Tugas Akhir mahasiswa **Universitas Pamulang (UNPAM)** untuk mata kuliah *Optimalisasi SEO*.

### Tim Mahasiswa

1. **Oddy**
2. **Sicilia**
3. **Febri**
4. **Hilmi**
5. **Eni**

Website landing page dan sistem operasional digital ini dirancang sebagai solusi komprehensif bagi UMKM kuliner **Ayam Geprek Sambel Ijo Al-Fariz Pamulang** guna mendongkrak visibilitas lokal di mesin pencari (SEO), memfasilitasi pemesanan interaktif mandiri, serta mengotomatisasi operasional dapur.

---

## 📌 Ringkasan Usaha & Identitas Bisnis

- **Nama Usaha**: UMKM Kuliner Ayam Geprek Sambel Ijo Al-Fariz
- **Lokasi Fisik**: Jl. Surya Kencana No. 27, Pamulang Barat (Tepat di Depan Gerbang Utama Kampus UNPAM), Tangerang Selatan
- **Jam Operasional**: 15.00 – 22.00 WIB (Buka Setiap Hari)
- **Kontak Resmi (WhatsApp)**: [+62 897-3816-530](https://wa.me/628973816530)
- **Domain Resmi**: [https://ayamsambelijopamulang.my.id](https://ayamsambelijopamulang.my.id)
- **Dokumen Terkait**: [PRD.md](file:///d:/project%20website/ayam-geprek-sambel-ijo-al-fariz/PRD.md), [DEPLOY-DOMAINESIA.md](file:///d:/project%20website/ayam-geprek-sambel-ijo-al-fariz/DEPLOY-DOMAINESIA.md), [DESIGN (1).md](file:///d:/project%20website/ayam-geprek-sambel-ijo-al-fariz/DESIGN%20(1).md)

---

## 🚀 Fitur Utama Sistem

### 1. Portal Pelanggan (Customer Facing)

- **Hero & Suasana Warung**: Tampilan interaktif cobek batu 3D, status gerobak buka/tutup *real-time*, dan navigasi cepat.
- **Katalog Menu Juara**:
  - *Paket Geprek + Nasi* (Rp 17.000, Best Seller): Ayam krispi fillet, sambel ijo dadakan, nasi pulen hangat, dan timun segar.
  - *Ayam Geprek Saja* (Rp 15.000, Alacarte): Potongan krispi jumbo berbalut sambel ijo cabai rawit pedas gurih.
- **Kalkulator Simulasi Pemesanan Kustom**:
  - Konfigurasi tingkat kepedasan dinamis (Level 1 sampai Level 5, ~20k hingga 120k+ SHU).
  - Pilihan penyajian sambal: *Dicampur di atas ayam*, *Dipisah di wadah cup*, atau *Tanpa sambal*.
  - Tambahan (*Add-ons*): Extra Sambel Rawit (+Rp 3.000), Tambah Nasi Pulen (+Rp 5.000).
  - Kalkulasi transparan: Base Total, Add-ons, PPN 11%, dan Grand Total.
- **Simulasi Pembayaran Digital & Struk Resmi**:
  - Pilihan metode: QRIS Dinamis (countdown 15 menit), E-Wallet (GoPay, OVO, DANA, ShopeePay), Virtual Account (BCA, Mandiri, BRI, SeaBank), dan Bayar Tunai di Tempat.
  - Pembuatan nomor transaksi unik (`TX-FARIZ-XXXXXX`).
  - Struk digital resmi (*Digital Receipt*) dengan opsi cetak/unduh.
- **Generator Pesanan WhatsApp Terstandarisasi**: Mengonversi rincian pesanan dan status transaksi menjadi format pesan WhatsApp rapi ke nomor kasir (+62 897-3816-530).
- **Riwayat & Pelacak Pesanan**: Riwayat transaksi tersimpan otomatis di browser (`localStorage`) dan sinkronisasi pelacakan status pesanan.
- **Ulasan & Bukti Sosial (Testimoni)**: Filter ulasan mahasiswa UNPAM & warga sekitar, beserta modal kirim ulasan baru pelanggan.
- **Peta Interaktif & Petunjuk Arah**: Google Maps interaktif dengan rute dan panduan patokan lokasi fisik gerobak di seberang gerbang utama UNPAM.

### 2. Fitur Kecerdasan Buatan (Google Gemini AI)

- **AI Culinary Advisor (`gemini-3.8-flash`)**: Konsultasi menu hemat budget mahasiswa, porsi gizi, rekomendasi level pedas, dan mode *Deep Thinking*.
- **Google Maps Grounding**: Navigasi dan rute otomatis menuju lokasi fisik warung berbasis koordinat Maps tervalidasi.
- **Google Search Grounding**: Informasi tren kuliner seputar kampus UNPAM.
- **AI Image Studio (`gemini-3.1-flash-lite-image`)**: Generator visual fotografi kuliner ayam geprek beresolusi tinggi (1K/2K/4K) dengan *fallback showcase* bawaan.

### 3. CRM Dapur Owner Al-Fariz (`/crm`)

- **Dashboard Ringkasan**: Statistik pesanan harian, omzet, rata-rata nilai transaksi, dan monitoring antrean.
- **Manajemen Pesanan Real-time**: Kelola alur status pemesanan (*Antrean*, *Dimasak*, *Siap Ambil*, *Selesai*, *Dibatalkan*).
- **Manajemen Katalog & Stok**: Tambah, ubah harga, ganti foto produk, dan atur ketersediaan menu.
- **Pelacakan Pesanan Pelanggan (`/crm#/track`)**: Antarmuka bagi pelanggan untuk memantau status masakan berdasarkan Nomor Transaksi (`TX-FARIZ-XXXXXX`).
- **Keamanan & Sesi**: Proteksi kata sandi owner (`OWNER_PASSWORD`) dengan sesi berbasis cookie terenkripsi (`SESSION_SECRET`).

---

## 🛠️ Arsitektur & Tumpukan Teknologi (Tech Stack)

| Lapisan | Teknologi | Versi / Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.0.1` |
| **Bahasa Pemrograman** | TypeScript | `^7.0.2` |
| **Build Tool & Bundler** | Vite | `^8.3.0` (Didukung plugin `@vitejs/plugin-react`) |
| **CSS & Desain Sistem** | Tailwind CSS v4 | `^4.3.3` (Neo-Brutalist Street-Food Style) |
| **Animasi & Interaksi** | Motion | `^12.23.24` |
| **Ikonografi** | Lucide React | `^1.54.0` |
| **State & Data Fetching** | TanStack React Query | `^5.104.1` |
| **Notifikasi / Toast** | Sonner | `^2.0.8` |
| **Backend Server** | Express.js & Node.js | Express `^4.22.3`, Node.js `>=18` |
| **Database CRM** | MySQL | Driver `mysql2: ^3.24.5` (Migrasi tabel otomatis) |
| **AI Integration** | Google Gen AI SDK | `@google/genai: ^2.4.0` (Gemini 3.8 Flash & Gemini 3.1 Flash Lite Image) |
| **Produksi Bundler** | esbuild | `^0.25.0` (Mengompilasi `server/index.ts` ke `server.cjs`) |

---

## 📁 Struktur Direktori

```text
ayam-geprek-sambel-ijo-al-fariz/
├── crm-owner/                  # Aset pendukung CRM owner
├── dist/                       # Output build produksi (website & CRM)
├── figma-assets/               # Aset desain & referensi UI
├── public/                     # Aset statis publik (.htaccess, robots.txt)
├── scripts/
│   └── bundle.js               # Skrip generator HTML standalone bundle
├── server/
│   └── index.ts                # Server backend utama (Express, CRM & API)
├── src/
│   ├── components/             # Komponen UI utama (Hero, Menu, Simulasi, Modal, dsb.)
│   ├── crm/                    # Frontend CRM Dapur Owner (Pages: Dashboard, Orders, Products, Track)
│   ├── data/                   # Data statis menu bawaan (menuData.ts)
│   ├── produk/                 # Foto hidangan & fotografi kuliner produk (WebP optimized)
│   ├── server/
│   │   ├── apiHandler.ts       # Handler endpoint Google Gemini AI
│   │   └── crm/                # Handler database MySQL & endpoint REST API CRM
│   ├── App.tsx                 # Root komponen portal pelanggan
│   ├── main.tsx                # Entry point aplikasi klien
│   └── types.ts                # Kontrak skema TypeScript
├── .env.example                # Templat variabel lingkungan
├── DEPLOY-DOMAINESIA.md        # Panduan deployment cPanel / DomaiNesia
├── DESIGN (1).md               # Dokumentasi sistem desain Neo-Brutalist
├── package.json                # Dependensi dan skrip proyek
├── PRD.md                      # Product Requirement Document lengkap
├── server.cjs                  # Bundle server Node.js hasil kompilasi
└── vite.config.ts              # Konfigurasi Vite & dev server
```

---

## ⚙️ Prasyarat Sistem & Konfigurasi Lingkungan

### Prasyarat

- **Node.js**: Versi `18.x` atau lebih baru
- **NPM**: Versi `9.x` atau lebih baru
- **MySQL**: Diperlukan untuk modul CRM dapur (opsional jika hanya menjalankan simulasi frontend lokal)

### Variabel Lingkungan (`.env.local` / `.env`)

Salin berkas [.env.example](file:///d:/project%20website/ayam-geprek-sambel-ijo-al-fariz/.env.example) menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Sesuaikan nilai variabel berikut:

```env
# Konfigurasi Google Gemini AI
GEMINI_API_KEY="AIzaSy..."

# URL Aplikasi
APP_URL="http://localhost:3000"

# Konfigurasi Database CRM (MySQL)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=alfariz_crm

# Autentikasi CRM Owner
OWNER_PASSWORD="ganti-dengan-kata-sandi-owner"
SESSION_SECRET="string-acak-panjang-rahasia-minimal-40-karakter"
```

---

## 💻 Panduan Menjalankan Proyek

### 1. Instalasi Dependensi

```bash
npm install
```

### 2. Mode Pengembangan (Development)

Jalankan server pengembangan terintegrasi:

```bash
npm run dev
```

- **Website Pelanggan**: Buka [http://localhost:3000](http://localhost:3000)
- **CRM Dapur Owner**: Buka [http://localhost:3000/crm](http://localhost:3000/crm) (Login menggunakan `OWNER_PASSWORD`)
- **Pelacakan Pesanan**: Buka [http://localhost:3000/crm#/track](http://localhost:3000/crm#/track)

### 3. Build & Jalankan Mode Produksi

Kompilasi aplikasi frontend dan server backend:

```bash
# Build frontend ke dist/ dan server ke server.cjs
npm run build

# Menjalankan server produksi
npm run start
```

### 4. Menghasilkan Standalone Bundle HTML (Offline Demo)

Untuk membuat berkas HTML tunggal mandiri tanpa ketergantungan server:

```bash
npm run bundle
```

Hasil file akan disimpan pada `bundle.html`.

---

## 🌐 Panduan Deployment (cPanel / DomaiNesia)

Proyek ini telah dikonfigurasi untuk berjalan di shared hosting atau VPS yang mendukung fitur **Setup Node.js App** (cPanel) dan database MySQL:

1. Lakukan kompilasi lokal: `npm run build`.
2. Siapkan arsip zip yang memuat:
   - `dist/`
   - `server.cjs`
   - `package.json`
   - `package-lock.json`
   - `.npmrc`
3. Buat database MySQL di cPanel dan berikan hak akses penuh (*ALL PRIVILEGES*).
4. Buat aplikasi di menu **Setup Node.js App** dengan startup file `server.cjs` dan Node.js versi 18+.
5. Masukkan seluruh *Environment Variables* di cPanel (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `OWNER_PASSWORD`, `SESSION_SECRET`, `GEMINI_API_KEY`).
6. Jalankan **Run NPM Install** lalu klik **Restart**.

Panduan langkah demi langkah yang detail tersedia di [DEPLOY-DOMAINESIA.md](file:///d:/project%20website/ayam-geprek-sambel-ijo-al-fariz/DEPLOY-DOMAINESIA.md).

---

## 📜 Skrip NPM yang Tersedia

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Vite development server di port 3000 |
| `npm run build` | Melakukan build frontend (`vite build`) dan server (`npm run build:server`) |
| `npm run build:server` | Mengompilasi `server/index.ts` ke format CommonJS `server.cjs` menggunakan esbuild |
| `npm run start` | Menjalankan server produksi Node.js (`node server.cjs`) |
| `npm run preview` | Meninjau hasil build Vite secara lokal |
| `npm run lint` | Melakukan pemeriksaan tipe TypeScript (`tsc --noEmit`) |
| `npm run bundle` | Menghasilkan berkas distribusi mandiri `bundle.html` |
| `npm run clean` | Menghapus folder `dist/` dan file `server.cjs` |

---

## 📄 Lisensi & Hak Cipta

© 2027 **Ayam Geprek Sambel Ijo Al-Fariz**. Hak Cipta Dilindungi Undang-Undang.  
Dikembangkan oleh Tim Mahasiswa Universitas Pamulang (Oddy, Sicilia, Febri, Hilmi, Eni) untuk mendukung digitalisasi UMKM kuliner sekitar kampus.
