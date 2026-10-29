# DuitKu

Aplikasi pencatat keuangan pribadi berbahasa Indonesia berbasis React, Express, dan MySQL.

## Prasyarat

- Node.js 18 atau lebih baru
- MySQL 8 atau MariaDB yang mendukung foreign key
- npm

## Instalasi

1. Buat database dan tabel:
   ```bash
   mysql -u root -p < database/duitku.sql
   ```
2. Pasang seluruh dependency:
   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```
3. Salin konfigurasi backend:
   ```bash
   copy backend\.env.example backend\.env
   ```
   Isi `DB_USER`, `DB_PASSWORD`, dan `SESSION_SECRET` sesuai lingkungan lokal.
4. Jalankan backend dan frontend:
   ```bash
   npm run dev --prefix backend
   npm run dev --prefix frontend
   ```

Frontend tersedia di `http://localhost:5173`, backend di `http://localhost:5000`.

## Penggunaan

Daftarkan akun baru. Kategori bawaan akan dibuat otomatis untuk akun tersebut. Semua data transaksi, kategori, dan target dipisahkan berdasarkan sesi login pengguna.

## Struktur

- `frontend/src`: halaman dan komponen React
- `backend/routes`: endpoint REST
- `backend/db`: koneksi MySQL
- `backend/middleware`: proteksi endpoint
- `database/duitku.sql`: skema database

## Arsitektur

Frontend React memanggil API Express melalui cookie sesi. Express memvalidasi input, memeriksa kepemilikan data, lalu menjalankan query berparameter menggunakan `mysql2/promise`. Password pengguna disimpan sebagai bcrypt hash. Pengeluaran dan pemasukan dihitung langsung dari transaksi database; target tabungan merupakan alokasi terpisah dan tidak mengubah saldo.

## Troubleshooting MySQL

- `Access denied`: cocokkan DB_USER dan DB_PASSWORD pada `backend/.env`.
- `Unknown database`: jalankan kembali `database/duitku.sql`.
- Port MySQL bukan 3306: ubah DB_PORT.
- Backend tidak terhubung: pastikan layanan MySQL aktif dan kredensial dapat digunakan oleh mysql CLI.
