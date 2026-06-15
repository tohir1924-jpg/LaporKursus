# Roadmap LaporKursus

## Status Awal

Project saat ini adalah prototype UI React/Vite statis. Data masih hard-coded, beberapa modul masih placeholder, dan belum ada backend Cloudflare Pages Functions, D1 migrations, auth, API, lockfile, atau git repository.

Target kerja bertahap: membawa project menuju MVP operasional minimal 95% selesai terhadap PRD.

## Tahap 1 - Fondasi Project

Tujuan:
- Install dependency dan buat lockfile.
- Pastikan build frontend berhasil.
- Inisialisasi git repository.
- Commit baseline awal.

Kriteria selesai:
- `npm run build` sukses.
- `package-lock.json` tersedia.
- Git repository aktif.
- Baseline project sudah di-commit.

## Tahap 2 - Struktur Frontend

Tujuan:
- Pecah `src/App.jsx` menjadi struktur folder rapi: `components`, `pages`, `lib`, `data`, dan `types` bila diperlukan.
- Tambahkan React Router.
- Pisahkan mock data dari komponen UI.
- Siapkan API client layer agar mudah diganti ke backend nyata.

Kriteria selesai:
- Navigasi berbasis router.
- Komponen utama tidak lagi menumpuk dalam satu file besar.
- Build tetap sukses.

## Tahap 3 - Fondasi Cloudflare dan Database

Tujuan:
- Tambahkan `wrangler.toml`.
- Buat folder `functions/api`.
- Buat folder `migrations`.
- Implementasikan schema awal D1 dari PRD.
- Tambahkan seed data dasar untuk demo internal.

Kriteria selesai:
- Struktur Cloudflare Pages + D1 tersedia.
- Migration SQL valid dan mencakup tabel inti.
- Konfigurasi deploy siap diisi database ID.

## Tahap 4 - API dan Auth

Tujuan:
- Implementasi login admin/pengajar sederhana.
- Tambahkan middleware auth dan role guard.
- Implementasi endpoint dasar untuk users, programs, classes, dan students.

Kriteria selesai:
- Login menghasilkan session/token.
- Endpoint sensitif terlindungi.
- CRUD master data dasar berjalan.

## Tahap 5 - Modul Absensi

Tujuan:
- Input absensi bulk per kelas dan tanggal.
- Edit absensi yang sudah ada.
- Rekap harian/bulanan.
- Warning alpa/telat/kehadiran rendah.

Kriteria selesai:
- Constraint duplikasi absensi dipakai.
- UI absensi memakai data API.
- Rekap absensi bisa ditampilkan dan diekspor CSV.

## Tahap 6 - Modul SPP

Tujuan:
- Generate tagihan bulanan idempotent.
- Input pembayaran.
- Update status lunas/sebagian/belum lunas otomatis.
- Daftar tunggakan dan rekap pemasukan.

Kriteria selesai:
- Constraint duplikasi tagihan dipakai.
- Status tagihan konsisten dengan total pembayaran.
- Export CSV tersedia.

## Tahap 7 - Pesan WhatsApp

Tujuan:
- CRUD template pesan.
- Preview pesan dengan variabel.
- Generate link WhatsApp.
- Simpan log pesan.

Kriteria selesai:
- Admin bisa membuat pesan dari template dan membuka WhatsApp.
- Riwayat pesan tersimpan.

## Tahap 8 - Project Siswa dan Laporan

Tujuan:
- CRUD project siswa.
- Input laporan progress.
- Riwayat laporan project.
- Kirim ringkasan via WhatsApp.
- Export laporan project.

Kriteria selesai:
- Progress project tersimpan dan bisa dilacak per siswa.
- Profil siswa menampilkan riwayat project.

## Tahap 9 - Polishing, Testing, dan Deploy

Tujuan:
- Perbaikan responsive UI.
- Validasi form dan error state.
- Testing role admin/pengajar.
- Deploy Cloudflare Pages.
- Dokumentasi penggunaan.

Kriteria selesai:
- Build dan smoke test sukses.
- App dapat digunakan end-to-end untuk alur MVP.
- Deploy production tersedia.
