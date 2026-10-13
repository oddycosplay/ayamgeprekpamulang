# Ayam Geprek Pamulang

<p align="center">
  <img src="./laptop_beranda.png" alt="Preview landing page Ayam Geprek Pamulang" width="900" />
</p>

<p align="center">
  <a href="https://your-demo-link.com" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-🚀-brightgreen?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/oddycosplay/ayamgeprekpamulang" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <a href="https://wa.me/628XXXXXXXXXX" target="_blank">
    <img src="https://img.shields.io/badge/WhatsApp-Order-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp Order" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge" alt="Google Gemini" />
</p>

## Tugas Akhir

Proyek ini merupakan Tugas Akhir mahasiswa Universitas Pamulang untuk mata kuliah *Optimalisasi SEO*.

Mahasiswa:
1. Oddy
2. Sicilia
3. Febri
4. Hilmi
5. Eni

Website landing page dan sistem operasional untuk usaha Ayam Geprek Al-Fariz Pamulang. Proyek ini dirancang sebagai solusi digital untuk memperkenalkan menu, layanan, dan proses pemesanan secara modern.

## Tentang Project

Project ini menggabungkan:

- Landing page restoran yang modern dan responsif
- Katalog menu dan simulasi pemesanan
- Integrasi ke WhatsApp untuk order cepat
- Fitur AI assistant untuk rekomendasi menu dan navigasi lokasi
- Studio gambar AI untuk visual produk
- Panel CRM untuk owner / admin
- Backend Express yang melayani frontend dan API

Project ini dibangun dengan React + TypeScript + Vite di sisi frontend, dan Express + MySQL + Gemini API di sisi backend.

## Fitur Utama

- Halaman promosi restoran dan brand storytelling
- Informasi menu, promo, layanan, testimoni, dan lokasi
- Simulasi pemesanan produk sesuai pilihan menu
- Tombol order langsung ke WhatsApp
- AI Advisor untuk membantu pelanggan memilih menu dan lokasi
- AI Image Studio untuk membuat visual makanan
- CRM owner untuk mengelola data operasional
- Server produksi untuk deployment di Node.js hosting

## Preview

<p align="center">
  <img src="./laptop_beranda.png" alt="Dashboard utama Ayam Geprek Pamulang" width="900" />
</p>

### Highlights

- UI landing page yang modern dan siap untuk portfolio
- Desain responsif untuk desktop dan mobile
- Fokus promosi produk serta pengalaman pembelian yang cepat
- Integrasi AI dan CRM untuk optimalisasi operasional usaha

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Express.js
- Database: MySQL
- AI: Google Gemini via @google/genai
- Build tools: Vite, esbuild

## Struktur Project

```bash
.
├── src/
│   ├── components/       # Komponen UI halaman
│   ├── crm/              # Modul CRM
│   ├── data/             # Data menu dan konten
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility library
│   ├── produk/           # Data produk / menu
│   ├── server/           # Logika API dan server-side
│   ├── App.tsx           # Entry utama aplikasi
│   ├── main.tsx          # Bootstrap React
│   └── types.ts          # Type definitions
├── server/
│   └── index.ts          # Server produksi Express
├── public/               # Asset statis
├── scripts/              # Script utility
├── .env.example          # Template environment
├── package.json          # Script dan dependency
├── tsconfig.json         # Konfigurasi TypeScript
├── vite.config.ts       # Konfigurasi Vite
├── README.md             # Dokumentasi project
└── ...
```

## Prasyarat

- Node.js >= 18
- MySQL (untuk CRM / database owner)
- API Key Gemini

## Setup Local

1. Clone repository
2. Install dependency:

```bash
npm install
```

3. Salin file environment:

```bash
cp .env.example .env.local
```

4. Isi variabel yang dibutuhkan pada `.env.local`:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=alfariz_crm
OWNER_PASSWORD="ganti-dengan-kata-sandi-owner"
SESSION_SECRET="ganti-dengan-string-acak-panjang"
```

5. Jalankan aplikasi dalam mode development:

```bash
npm run dev
```

Aplikasi akan berjalan di:

- Frontend: http://localhost:3000
- CRM owner: http://localhost:3000/crm

## Build untuk Production

```bash
npm run build
npm start
```

Perintah build akan menghasilkan bundle frontend dan file server produksi (`server.cjs`).

## Catatan Deployment

Project ini sudah disiapkan untuk deployment di hosting Node.js seperti cPanel / DomaiNesia. Server produksi ada pada `server/index.ts` dan akan menyajikan static build dari `dist/` serta menangani API backend.

## License

Project ini menggunakan lisensi yang sesuai pada repo. Silakan cek file konfigurasi project untuk detail lisensi yang berlaku.

## Developer Notes

Untuk kebutuhan usaha kuliner, project ini fokus pada:

- Meningkatkan brand awareness
- Menyederhanakan proses order
- Menawarkan pengalaman digital modern kepada pelanggan
- Memberikan alat operasional yang sederhana bagi owner

Semoga README ini membantu dokumentasi project lebih jelas dan siap dipakai untuk portfolio, demo, maupun kebutuhan deployment.
