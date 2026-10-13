# Upload ke Hosting DomaiNesia (cPanel + Node.js + MySQL)

Website pelanggan dan CRM owner berjalan sebagai **satu aplikasi Node.js**
(`server.cjs`) yang memakai **MySQL**. Jadi paket hosting harus punya menu
**Setup Node.js App** di cPanel. Kalau menu itu tidak ada di paketmu, minta
aktivasi ke CS DomaiNesia atau pakai paket yang mendukung Node.js / VPS.

Alamat setelah online:

- Website pelanggan: `https://domainkamu.com`
- CRM owner: `https://alfariz-crm.higgsfield.app/`

---

## 1. Build di laptop

```bash
npm install
npm run build
```

Hasilnya:

- `dist/` berisi file website + halaman CRM
- `server.cjs` berisi server Node.js

## 2. Siapkan file untuk diupload

Buat file zip berisi **hanya** ini:

```
dist/
server.cjs
package.json
package-lock.json
.npmrc
```

Jangan ikutkan `node_modules/`, `.env.local`, `crm-owner/`, atau `uploads/`.

## 3. Buat database MySQL di cPanel

1. cPanel > **MySQL® Databases** (atau **Manage My Databases**).
2. **Create New Database**, misalnya `alfariz_crm`. cPanel akan menambahkan
   awalan nama akun, contoh `namaakun_alfariz_crm`. Catat nama lengkapnya.
3. **Add New User**, buat user + kata sandi yang kuat. Catat juga.
4. **Add User To Database**: pilih user dan database tadi, centang
   **ALL PRIVILEGES**, lalu simpan.

Tabel dan menu awal dibuat otomatis oleh aplikasi saat pertama kali dibuka.

## 4. Upload file

1. cPanel > **File Manager**.
2. Buat folder di luar `public_html`, misalnya `/home/namaakun/ayamgeprek`.
3. Upload zip dari langkah 2 ke folder itu, lalu klik kanan > **Extract**.

## 5. Buat aplikasi Node.js

cPanel > **Setup Node.js App** > **Create Application**:

| Isian | Nilai |
| --- | --- |
| Node.js version | 18 atau lebih baru (pilih versi tertinggi) |
| Application mode | Production |
| Application root | `ayamgeprek` |
| Application URL | domain kamu (kosongkan path) |
| Application startup file | `server.cjs` |

Klik **Create**.

### Environment variables

Di halaman aplikasi yang sama, bagian **Environment variables**, tambahkan:

| Nama | Isi |
| --- | --- |
| `MYSQL_HOST` | `localhost` |
| `MYSQL_PORT` | `3306` |
| `MYSQL_USER` | user MySQL dari langkah 3 (lengkap dengan awalan) |
| `MYSQL_PASSWORD` | kata sandi user MySQL |
| `MYSQL_DATABASE` | nama database lengkap dari langkah 3 |
| `OWNER_PASSWORD` | kata sandi login owner CRM (buat yang kuat) |
| `SESSION_SECRET` | teks acak panjang, minimal 40 karakter |
| `GEMINI_API_KEY` | (opsional) API key Gemini untuk fitur AI |

Klik **Save**.

### Install paket dan jalankan

1. Masih di halaman aplikasi, klik **Run NPM Install** dan tunggu selesai.
   File `.npmrc` sudah mengatur `legacy-peer-deps`, jadi tidak perlu opsi
   tambahan.
2. Klik **Restart**.
3. Buka domain kamu. Lalu buka `/crm` dan login dengan `OWNER_PASSWORD`.

## 6. Aktifkan HTTPS

cPanel > **SSL/TLS Status** > pilih domain > **Run AutoSSL**. Setelah aktif,
login owner otomatis memakai cookie aman.

## Update website setelah ada perubahan

1. Di laptop: `npm run build`.
2. Upload ulang `dist/` dan `server.cjs` (timpa yang lama).
3. Kalau `package.json` berubah, klik **Run NPM Install**.
4. Klik **Restart** di Setup Node.js App.

Data di MySQL dan foto yang sudah diupload owner (folder `uploads/` di
server) tidak hilang saat update.

## Kalau ada masalah

- **Halaman CRM: "MySQL belum menyala atau user/password salah"**: cek lagi
  `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` (harus lengkap dengan
  awalan akun), dan pastikan user sudah ditambahkan ke database dengan
  ALL PRIVILEGES.
- **"OWNER_PASSWORD belum diatur"**: isi environment variable lalu Restart.
- **Error 503 / aplikasi tidak jalan**: buka file `stderr.log` di folder
  aplikasi lewat File Manager untuk melihat pesan errornya.
