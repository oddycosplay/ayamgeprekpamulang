# Ayam Penyet Sambel Ijo Al-Fariz

![Preview Landing Page Ayam Penyet Sambel Ijo Al-Fariz](./laptop_beranda.png)
<p align="center">
  <a href="[https://your-live-demo-url.com](https://ayamsambelijopamulang.my.id)">
    <img src="https://img.shields.io/badge/Live-Demo-34D058?style=for-the-badge&logo=github" alt="Live Demo" />
  </a>
  <a href="https://github.com/oddycosplay/ayamgeprekpamulang/tree/main">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <a href="https://wa.me/6281234567890">
    <img src="https://img.shields.io/badge/WhatsApp-Order-25D366?style=for-the-badge&logo=whatsapp" alt="WhatsApp Order" />
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind-CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql" alt="MySQL" />
  <img src="https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google" alt="Google Gemini" />
</p>

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

## 1. Gambaran Umum Proyek

Proyek ini merupakan pengembangan website dan sistem operasional digital untuk UMKM kuliner Ayam Penyet Sambel Ijo Al-Fariz yang berlokasi di Pamulang, Tangerang Selatan. Tujuan utama dari pengembangan ini adalah meningkatkan visibilitas usaha di dunia digital, mempermudah proses pemesanan, serta mendukung pengelolaan operasional usaha secara lebih efisien.

Website yang dibangun tidak hanya berfungsi sebagai media promosi, tetapi juga sebagai kanal transaksi digital yang memungkinkan pelanggan melakukan pemesanan dengan cepat, melihat menu, menilai produk, dan menerima informasi mengenai status pesanan secara real-time.

---

## 2. Latar Belakang dan Tujuan

UMKM kuliner memiliki kebutuhan untuk bertransformasi dari model penjualan konvensional menuju sistem digital agar dapat bersaing dan berkembang di era teknologi. Berdasarkan kebutuhan tersebut, website ini dirancang untuk:

- Menampilkan identitas usaha dan profil bisnis secara profesional.
- Menyajikan katalog menu secara rapi dan mudah dipahami.
- Memfasilitasi proses pemesanan melalui platform digital.
- Mengintegrasikan komunikasi order ke WhatsApp agar lebih praktis.
- Menyediakan panel admin untuk mengelola pesanan, menu, dan laporan penjualan.
- Meningkatkan pengalaman pelanggan melalui tampilan modern dan responsif.

---

## 3. Ruang Lingkup Sistem

Sistem yang dikembangkan mencakup beberapa komponen utama, yaitu:

- Portal pelanggan
- Modul katalog menu
- Modul keranjang dan checkout
- Modul transaksi dan pembayaran
- Modul pengelolaan pesanan oleh admin
- Modul tracking status pesanan
- Modul ulasan dan testimoni
- Integrasi AI untuk rekomendasi dan interaksi pelanggan

---

## 4. Flowchart Sistem

```mermaid
flowchart TD
    A[Pengunjung masuk ke website] --> B[Melihat menu dan promo]
    B --> C{Ingin memesan?}
    C -- Ya --> D[Login / daftar akun]
    C -- Tidak --> E[Melihat informasi toko]
    D --> F[Tambah menu ke keranjang]
    F --> G[Review pesanan]
    G --> H{Metode pembayaran}
    H -- COD --> I[Konfirmasi pesanan]
    H -- Transfer / E-Wallet --> J[Bayar]
    J --> K[Order diterima sistem]
    I --> K
    K --> L[Admin menerima order]
    L --> M[Proses pesanan]
    M --> N{Ambil di tempat / antar}
    N -- Antar --> O[Pesanan dikirim]
    N -- Ambil --> P[Pesanan siap diambil]
    O --> Q[Pelanggan menerima pesanan]
    P --> Q
    Q --> R[Review dan rating]
    L --> S[Update status pesanan]
    S --> T[Data order tersimpan di database]
```

---

## 5. Sistem Usulan

### 5.1 Fitur Utama

- Landing page dengan hero section, menu unggulan, promo, testimoni, dan lokasi usaha
- Katalog produk yang mencakup nama menu, harga, deskripsi, dan foto
- Keranjang belanja dan proses checkout
- Opsi metode pembayaran seperti COD, transfer, dan e-wallet
- Tracking status pesanan dari menunggu hingga selesai
- Panel admin untuk mengelola menu, pesanan, dan laporan
- Integrasi WhatsApp untuk komunikasi dan konfirmasi order
- Fitur ulasan pelanggan untuk meningkatkan kepercayaan publik

### 5.2 Arsitektur Sistem

Berdasarkan komposisi repository yang mayoritas berupa TypeScript, solusi yang paling sesuai adalah menggunakan pendekatan modular berbasis web modern:

- Frontend: Next.js + TypeScript
- Backend: Node.js + Express atau API route berbasis Next.js
- Database: PostgreSQL / MySQL
- Manajemen data: relasional database untuk transaksi dan catalog menu
- Penyimpanan media: sistem upload gambar produk dan promosi
- Integrasi eksternal: WhatsApp API, payment gateway, dan layanan AI

### 5.3 Modul utama

- User Module
  - Registrasi dan login
  - Profil pengguna
  - Riwayat pemesanan

- Product Module
  - Manajemen kategori menu
  - Tambah, ubah, dan hapus produk
  - Pengaturan stok dan harga

- Order Module
  - Pembuatan transaksi
  - Pemantauan status order
  - Log pesanan

- Payment Module
  - COD
  - Transfer bank
  - E-wallet

- Admin Module
  - Dashboard penjualan
  - Laporan harian dan bulanan
  - Manajemen pelanggan dan pesanan

---

## 6. ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : makes
    USERS ||--o{ REVIEWS : writes
    CATEGORIES ||--o{ PRODUCTS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : includes
    ORDERS ||--o{ ORDER_ITEMS : has
    ORDERS ||--o| PAYMENTS : uses

    USERS {
        int id PK
        string name
        string email
        string password
        string role
        datetime created_at
    }

    CATEGORIES {
        int id PK
        string name
        string description
    }

    PRODUCTS {
        int id PK
        int category_id FK
        string name
        text description
        decimal price
        int stock
        string image_url
        boolean is_available
    }

    ORDERS {
        int id PK
        int user_id FK
        decimal total_price
        string status
        string payment_method
        datetime created_at
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal subtotal
    }

    PAYMENTS {
        int id PK
        int order_id FK
        string payment_type
        string payment_status
        string transaction_code
        datetime paid_at
    }

    REVIEWS {
        int id PK
        int user_id FK
        int product_id FK
        int rating
        text comment
        datetime created_at
    }
```

---

## 7. Wireframe UI

Berikut gambaran struktur antarmuka pengguna yang diusulkan:

```mermaid
flowchart LR
    A[Halaman Awal / Landing Page] --> B[Hero Section]
    A --> C[Menu Unggulan]
    A --> D[Promo dan Diskon]
    A --> E[Testimoni]
    A --> F[Lokasi dan Kontak]

    G[Halaman Menu] --> H[Kategori Menu]
    G --> I[Daftar Produk]
    G --> J[Detail Produk]
    J --> K[Tambah ke Keranjang]

    L[Halaman Keranjang] --> M[Review Pesanan]
    M --> N[Checkout]
    N --> O[Pilih Metode Pembayaran]
    O --> P[Konfirmasi Order]

    Q[Halaman Admin] --> R[Dashboard]
    Q --> S[Daftar Pesanan]
    Q --> T[Manajemen Menu]
    Q --> U[Laporan Penjualan]

    V[Halaman Tracking] --> W[Input Nomor Order]
    W --> X[Status Pesanan]
```

### 7.1 Deskripsi Wireframe

- Halaman utama menampilkan brand awareness, hero banner, promo, dan informasi usaha
- Halaman menu menampilkan daftar produk berdasarkan kategori
- Halaman detail produk menampilkan foto, deskripsi, pilihan rasa/porsi, dan tombol tambah ke keranjang
- Halaman checkout menginformasikan total pembayaran, metode pembayaran, dan data pengiriman
- Halaman admin memungkinkan owner mengelola menu, order, dan laporan usaha
- Halaman tracking memungkinkan pelanggan mengecek status pesanan tanpa perlu menghubungi admin secara langsung

---

## 8. Struktur Folder Proyek

```text
ayam-geprek-sambel-ijo-al-fariz/
├── public/                     # Aset publik dan konfigurasi server
│   ├── .htaccess
│   ├── llms.txt
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manifest files
├── src/
│   ├── components/            # Komponen reusable UI
│   ├── crm/                   # Dashboard admin / CRM
│   ├── data/                  # Data menu dan konfigurasi aplikasi
│   ├── hooks/                 # Custom hooks
│   ├── pages/                 # Halaman aplikasi
│   ├── services/              # Integrasi API dan backend
│   ├── styles/                # Styling global
│   ├── types/                 # Interface TypeScript
│   ├── utils/                 # Helper & utility function
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── server/
│   └── index.ts               # Server backend utama
├── scripts/
│   └── bundle.js              # Script bundle HTML / distribusi
├── crm-owner/                 # Asset pendukung dashboard owner
├── dist/                      # Hasil build produksi
├── figma-assets/              # Referensi UI dan desain
├── .env.example               # Template environment variable
├── DEPLOY-DOMAINESIA.md       # Panduan deployment
├── DESIGN (1).md              # Dokumentasi desain
├── package.json               # Dependency dan script proyek
├── PRD.md                     # Product Requirement Document
├── README.md                  # Dokumentasi proyek
├── server.cjs                 # Build server produksi
├── vite.config.ts             # Konfigurasi Vite
├── tsconfig.json
├── package-lock.json
└── .gitignore
```

---

## 9. Teknologi yang Digunakan

| Layer | Teknologi | Keterangan |
| :--- | :--- | :--- |
| Frontend | React + TypeScript | Antarmuka website modern dan responsif |
| Build Tool | Vite | Proses development dan build lebih cepat |
| Styling | Tailwind CSS | Desain UI yang cepat dan konsisten |
| Backend | Express.js + Node.js | Proses API dan pengelolaan data |
| Database | MySQL / PostgreSQL | Penyimpanan data pelanggan, order, dan menu |
| AI Integration | Google Gemini | Rekomendasi, interaksi, dan dukungan AI |
| Deployment | cPanel, Vercel, Render, atau VPS | Publikasi project ke lingkungan production |

---

## 10. Prasyarat Sistem

- Node.js versi 18 atau lebih tinggi
- npm atau pnpm
- MySQL / PostgreSQL untuk modul CRM dan database transaksi
- Access key untuk integrasi AI (Google Gemini)
- Server atau hosting untuk deployment publik

---

## 11. Konfigurasi Lingkungan

Salin file `.env.example` menjadi `.env.local` lalu sesuaikan isinya:

```bash
cp .env.example .env.local
```

Contoh konfigurasi:

```env
GEMINI_API_KEY="your_api_key"
APP_URL="http://localhost:3000"
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=alfariz_crm
OWNER_PASSWORD="your_owner_password"
SESSION_SECRET="your_secure_session_secret"
```

---

## 12. Panduan Menjalankan Proyek

### 12.1 Instalasi Dependensi

```bash
npm install
```

### 12.2 Mode Development

```bash
npm run dev
```

Akses aplikasi di:

- Website pelanggan: http://localhost:3000
- Dashboard admin: http://localhost:3000/crm
- Tracking order: http://localhost:3000/crm#/track

### 12.3 Build Produksi

```bash
npm run build
npm run start
```

---

## 13. Deployment

Proyek ini dapat di-deploy pada platform seperti:

- cPanel / DomaiNesia
- Vercel
- Render
- VPS / Ubuntu Server

Panduan deploy lebih detail tersedia di file [DEPLOY-DOMAINESIA.md](DEPLOY-DOMAINESIA.md).

---

## 14. Hasil yang Diharapkan

Dengan sistem ini, diharapkan usaha Ayam Penyet Sambel Ijo Al-Fariz dapat:

- Meningkatkan brand awareness dan visibilitas online
- Mempercepat proses pemesanan barang dan layanan
- Memudahkan owner dalam mengelola order dan penjualan
- Meningkatkan kepuasan pelanggan melalui akses yang cepat, modern, dan informatif

---

## 15. Tim Pengembang

Proyek ini dikembangkan oleh mahasiswa Universitas Pamulang sebagai bagian dari tugas akhir dan pengembangan digitalisasi UMKM kuliner.

- Oddy
- Sicilia
- Febri
- Hilmi
- Eni

---

## 16. Lisensi

© 2027 Ayam Penyet Sambel Ijo Al-Fariz. Seluruh hak cipta dilindungi undang-undang.

Dikembangkan untuk mendukung digitalisasi usaha kuliner dan peningkatan kualitas layanan pelanggan secara berkelanjutan.
