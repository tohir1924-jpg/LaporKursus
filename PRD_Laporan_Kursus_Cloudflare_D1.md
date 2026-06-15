# PRD Web App Laporan Kursus

**Nama sementara produk:** LaporKursus  
**Versi dokumen:** 1.0  
**Tanggal:** 8 Juni 2026  
**Stack utama:** Cloudflare Pages + Pages Functions + Cloudflare D1  
**Target pengguna:** Pemilik kursus, admin kursus, pengajar, siswa/orang tua

---

## 1. Ringkasan Produk

LaporKursus adalah web app untuk membantu lembaga kursus mengelola laporan operasional harian dan bulanan. Aplikasi ini berfokus pada pencatatan absensi siswa, pengingat kehadiran atau pembayaran, pengelolaan SPP bulanan, serta laporan perkembangan project siswa.

Produk ini ditujukan untuk kursus kecil hingga menengah yang membutuhkan sistem sederhana, ringan, murah dijalankan, mudah diakses dari browser, dan tidak terlalu kompleks seperti sistem akademik sekolah besar.

---

## 2. Latar Belakang Masalah

Banyak lembaga kursus masih mencatat data operasional menggunakan buku, spreadsheet, atau chat WhatsApp yang tercecer. Masalah yang sering terjadi:

1. Rekap absensi sulit dibuat secara cepat.
2. Admin kesulitan mengetahui siswa yang sering alpa atau telat.
3. Pengingat jadwal dan SPP masih dikirim manual satu per satu.
4. Data pembayaran SPP bulanan tidak selalu rapi.
5. Perkembangan project siswa tidak terdokumentasi dengan baik.
6. Orang tua/siswa sulit mendapatkan laporan perkembangan secara jelas.

Akibatnya, pemilik kursus dan pengajar membutuhkan waktu tambahan untuk mengecek data, membuat laporan, dan menghubungi siswa/orang tua.

---

## 3. Tujuan Produk

Tujuan utama produk:

1. Mempermudah pencatatan kehadiran siswa dengan status H, A, I, dan T.
2. Membantu admin mengirim pengingat kepada siswa/orang tua.
3. Mengelola SPP bulanan secara rapi dan mudah dipantau.
4. Mendokumentasikan laporan project siswa secara berkala.
5. Menyediakan rekap laporan yang bisa diekspor.
6. Menjadi sistem operasional sederhana untuk kursus kecil/menengah.

---

## 4. Ruang Lingkup MVP

MVP fokus pada fitur inti yang langsung dibutuhkan dalam operasional kursus.

### 4.1 Termasuk dalam MVP

1. Login admin dan pengajar.
2. Manajemen data siswa.
3. Manajemen kelas/program kursus.
4. Input absensi dengan status:
   - H = Hadir
   - A = Alpa
   - I = Izin
   - T = Telat lebih dari 15 menit
5. Rekap absensi harian dan bulanan.
6. Pengingat siswa/orang tua melalui link WhatsApp.
7. Manajemen tagihan SPP bulanan.
8. Pencatatan pembayaran SPP.
9. Laporan project siswa.
10. Dashboard ringkas.
11. Export data ke Excel/CSV.
12. Pengaturan template pesan.

### 4.2 Tidak Termasuk dalam MVP

1. WhatsApp API otomatis.
2. Payment gateway otomatis.
3. Login siswa/orang tua.
4. Aplikasi Android/iOS native.
5. Multi-cabang kompleks.
6. Sistem sertifikat otomatis.
7. Upload file project besar.
8. Notifikasi push otomatis.

---

## 5. Target Pengguna

### 5.1 Admin / Owner Kursus

Admin bertanggung jawab mengelola data siswa, kelas, absensi, pembayaran, laporan, dan template pesan.

Kebutuhan utama:

- Melihat kondisi kursus secara cepat.
- Mengetahui siswa yang belum bayar SPP.
- Mengirim pengingat jadwal atau pembayaran.
- Membuat laporan bulanan.

### 5.2 Pengajar

Pengajar bertanggung jawab mengisi absensi dan laporan project siswa.

Kebutuhan utama:

- Mengisi absensi dengan cepat.
- Melihat daftar siswa per kelas.
- Menulis catatan perkembangan siswa.
- Melihat riwayat project siswa.

### 5.3 Siswa / Orang Tua

Pada MVP, siswa/orang tua belum memiliki akun. Mereka menerima informasi melalui pesan WhatsApp yang dikirim admin/pengajar.

Kebutuhan utama:

- Mendapat pengingat jadwal.
- Mendapat informasi SPP.
- Mendapat laporan perkembangan project.

---

## 6. Role dan Hak Akses

| Role | Hak Akses |
|---|---|
| Owner/Admin | Akses penuh semua modul |
| Pengajar | Input absensi, lihat kelas yang diajar, input laporan project |
| Viewer opsional | Hanya melihat laporan tertentu |

Untuk MVP, role yang wajib dibuat hanya:

1. Admin
2. Pengajar

---

## 7. Modul dan Fitur

## 7.1 Dashboard

Dashboard adalah halaman utama setelah login.

### Informasi yang Ditampilkan

1. Total siswa aktif.
2. Total kelas/program aktif.
3. Kehadiran hari ini.
4. Jumlah siswa telat hari ini.
5. Jumlah siswa alpa hari ini.
6. SPP belum lunas bulan berjalan.
7. Project siswa yang belum diperbarui.
8. Aktivitas terbaru.

### Kartu Statistik

Contoh kartu:

- Siswa Aktif: 48
- Hadir Hari Ini: 36
- Telat: 5
- Alpa: 4
- SPP Belum Lunas: 12
- Project Perlu Update: 8

### Quick Action

1. Input Absensi
2. Tambah Siswa
3. Input Pembayaran
4. Buat Laporan Project
5. Kirim Pengingat

---

## 7.2 Manajemen Siswa

### Data Siswa

Field utama:

| Field | Tipe | Keterangan |
|---|---|---|
| id | string/uuid | ID siswa |
| nama | text | Nama lengkap siswa |
| nomor_wa | text | Nomor WhatsApp siswa/orang tua |
| wali_nama | text | Nama orang tua/wali, opsional |
| wali_wa | text | Nomor WhatsApp wali, opsional |
| program_id | string | Program kursus |
| class_id | string | Kelas siswa |
| tanggal_masuk | date | Tanggal mulai kursus |
| status | enum | aktif, cuti, nonaktif |
| catatan | text | Catatan khusus |

### Fitur

1. Tambah siswa.
2. Edit data siswa.
3. Nonaktifkan siswa.
4. Cari siswa.
5. Filter berdasarkan kelas/program/status.
6. Lihat profil siswa.

### Halaman Profil Siswa

Berisi:

1. Data pribadi.
2. Riwayat kehadiran.
3. Riwayat SPP.
4. Riwayat project.
5. Catatan pengajar.
6. Tombol kirim pesan WhatsApp.

---

## 7.3 Manajemen Kelas dan Program

### Program Kursus

Contoh:

- Coding Kids
- Desain Grafis
- Web Development
- Bahasa Inggris
- Matematika
- Microsoft Office

Field:

| Field | Tipe | Keterangan |
|---|---|---|
| id | string/uuid | ID program |
| nama | text | Nama program |
| deskripsi | text | Deskripsi program |
| spp_default | integer | Nominal SPP default |
| status | enum | aktif/nonaktif |

### Kelas

Field:

| Field | Tipe | Keterangan |
|---|---|---|
| id | string/uuid | ID kelas |
| program_id | string | Relasi ke program |
| nama | text | Nama kelas |
| pengajar_id | string | Pengajar utama |
| hari | text | Hari kursus |
| jam_mulai | time | Jam mulai |
| jam_selesai | time | Jam selesai |
| status | enum | aktif/nonaktif |

---

## 7.4 Absensi Kehadiran

Absensi adalah fitur utama aplikasi.

### Status Absensi

| Kode | Arti | Keterangan |
|---|---|---|
| H | Hadir | Siswa hadir tepat waktu |
| A | Alpa | Tidak hadir tanpa keterangan |
| I | Izin | Tidak hadir dengan izin |
| T | Telat | Telat lebih dari 15 menit |

### Alur Input Absensi

1. Pengajar/admin memilih kelas.
2. Sistem menampilkan daftar siswa aktif di kelas tersebut.
3. Pengajar/admin memilih tanggal pertemuan.
4. Pengajar/admin mengisi status H, A, I, atau T.
5. Jika status T, pengajar dapat mengisi jumlah menit keterlambatan.
6. Pengajar dapat menambahkan catatan.
7. Sistem menyimpan absensi.
8. Sistem memperbarui rekap otomatis.

### Aturan Validasi

1. Satu siswa hanya boleh memiliki satu data absensi untuk kelas dan tanggal yang sama.
2. Status wajib diisi.
3. Jika status T, sistem menyarankan pengisian menit keterlambatan.
4. Jika absensi tanggal tersebut sudah pernah dibuat, tombol berubah menjadi Edit Absensi.

### Rekap Absensi

Rekap tersedia dalam bentuk:

1. Harian.
2. Mingguan.
3. Bulanan.
4. Per siswa.
5. Per kelas.

### Warning Otomatis

Sistem memberi label perhatian jika:

1. Siswa alpa 2 kali berturut-turut.
2. Siswa telat 3 kali atau lebih dalam satu bulan.
3. Kehadiran siswa kurang dari 75% dalam bulan berjalan.

---

## 7.5 Pesan Pengingat

Pada MVP, pengiriman pesan dilakukan menggunakan link WhatsApp. Sistem membuat teks otomatis berdasarkan template, lalu admin/pengajar mengirim melalui WhatsApp.

### Jenis Pesan

1. Pengingat jadwal kursus.
2. Pengingat siswa alpa.
3. Pengingat siswa telat.
4. Pengingat SPP.
5. Laporan project siswa.
6. Pesan umum.

### Template Pesan

Template mendukung variabel:

- {{nama_siswa}}
- {{nama_wali}}
- {{nama_kelas}}
- {{nama_program}}
- {{tanggal}}
- {{jam_mulai}}
- {{bulan}}
- {{nominal_spp}}
- {{status_project}}
- {{catatan_project}}

### Contoh Template Pengingat Jadwal

```text
Assalamu’alaikum, {{nama_siswa}}.
Mengingatkan bahwa jadwal kursus {{nama_program}} hari ini pukul {{jam_mulai}}.
Mohon hadir tepat waktu. Terima kasih.
```

### Contoh Template SPP

```text
Assalamu’alaikum Bapak/Ibu {{nama_wali}}.
Kami mengingatkan bahwa SPP bulan {{bulan}} atas nama {{nama_siswa}} sebesar {{nominal_spp}} belum tercatat lunas.
Terima kasih.
```

### Fitur

1. Pilih template pesan.
2. Pilih penerima.
3. Preview pesan.
4. Tombol buka WhatsApp.
5. Simpan riwayat pesan sebagai log internal.

---

## 7.6 SPP Bulanan

Modul SPP digunakan untuk membuat dan memantau tagihan bulanan siswa.

### Status Tagihan

| Status | Keterangan |
|---|---|
| Belum Lunas | Belum ada pembayaran |
| Sebagian | Sudah membayar sebagian |
| Lunas | Sudah lunas |
| Dibebaskan | Tidak perlu membayar untuk bulan tersebut |

### Field Tagihan

| Field | Tipe | Keterangan |
|---|---|---|
| id | string/uuid | ID tagihan |
| student_id | string | ID siswa |
| bulan | integer | Bulan tagihan |
| tahun | integer | Tahun tagihan |
| nominal | integer | Nominal SPP |
| status | enum | belum_lunas, sebagian, lunas, dibebaskan |
| jatuh_tempo | date | Tanggal jatuh tempo |
| catatan | text | Catatan |

### Field Pembayaran

| Field | Tipe | Keterangan |
|---|---|---|
| id | string/uuid | ID pembayaran |
| fee_id | string | ID tagihan |
| tanggal_bayar | date | Tanggal pembayaran |
| jumlah_bayar | integer | Jumlah pembayaran |
| metode | enum | cash, transfer, qris, lainnya |
| catatan | text | Catatan pembayaran |

### Fitur

1. Generate tagihan bulanan.
2. Input pembayaran.
3. Edit pembayaran.
4. Lihat daftar belum lunas.
5. Kirim pengingat SPP.
6. Rekap pemasukan bulanan.
7. Export laporan SPP.

### Aturan Bisnis

1. Tagihan dibuat per siswa per bulan.
2. Nominal default mengikuti program, tetapi bisa diedit per siswa.
3. Jika total pembayaran sama atau lebih dari nominal tagihan, status menjadi Lunas.
4. Jika total pembayaran lebih dari 0 tetapi kurang dari nominal, status menjadi Sebagian.
5. Jika belum ada pembayaran, status Belum Lunas.

---

## 7.7 Laporan Project Siswa

Modul ini digunakan untuk mencatat perkembangan project siswa.

### Data Project

| Field | Tipe | Keterangan |
|---|---|---|
| id | string/uuid | ID project |
| student_id | string | ID siswa |
| class_id | string | ID kelas |
| judul | text | Judul project |
| deskripsi | text | Deskripsi project |
| tanggal_mulai | date | Tanggal mulai |
| target_selesai | date | Target selesai |
| status | enum | belum_mulai, proses, revisi, selesai |
| progress | integer | Progress 0-100 |
| link_project | text | Link hasil project |

### Data Laporan Project

| Field | Tipe | Keterangan |
|---|---|---|
| id | string/uuid | ID laporan |
| project_id | string | ID project |
| tanggal_laporan | date | Tanggal laporan |
| progress | integer | Progress terbaru |
| status | enum | belum_mulai, proses, revisi, selesai |
| catatan_pengajar | text | Catatan pengajar |
| target_berikutnya | text | Target berikutnya |
| feedback | text | Feedback untuk siswa/orang tua |

### Fitur

1. Tambah project siswa.
2. Update progress project.
3. Tambah catatan perkembangan.
4. Simpan link project.
5. Kirim laporan project via WhatsApp.
6. Lihat riwayat laporan project.
7. Export laporan project.

### Contoh Laporan Project

```text
Nama Siswa: Ahmad
Project: Website Portofolio Sederhana
Progress: 70%
Status: Proses
Catatan: Struktur halaman sudah baik, perlu merapikan warna dan jarak antar elemen.
Target Berikutnya: Menambahkan halaman kontak dan upload ke hosting.
```

---

## 7.8 Laporan dan Export

### Jenis Laporan

1. Laporan absensi per kelas.
2. Laporan absensi per siswa.
3. Laporan SPP bulanan.
4. Laporan tunggakan SPP.
5. Laporan project siswa.
6. Laporan ringkas per siswa.

### Format Export MVP

1. CSV.
2. Excel `.xlsx`.

PDF dapat ditambahkan pada fase berikutnya.

---

## 8. User Flow

## 8.1 Flow Input Absensi

1. Login sebagai admin/pengajar.
2. Buka menu Absensi.
3. Pilih kelas.
4. Pilih tanggal.
5. Daftar siswa muncul.
6. Pilih status H/A/I/T.
7. Tambahkan catatan jika perlu.
8. Simpan.
9. Sistem menampilkan ringkasan absensi.

## 8.2 Flow Kirim Pengingat SPP

1. Login sebagai admin.
2. Buka menu SPP Bulanan.
3. Filter siswa belum lunas.
4. Pilih siswa.
5. Klik Kirim Pengingat.
6. Sistem menampilkan preview pesan.
7. Admin klik Buka WhatsApp.
8. Pesan dikirim manual melalui WhatsApp.
9. Sistem menyimpan log bahwa pesan sudah dibuat/dikirim manual.

## 8.3 Flow Laporan Project

1. Login sebagai pengajar.
2. Buka menu Project Siswa.
3. Pilih kelas dan siswa.
4. Pilih project.
5. Tambahkan laporan progress.
6. Isi status, progress, catatan, dan target berikutnya.
7. Simpan.
8. Jika perlu, kirim laporan ke siswa/orang tua via WhatsApp.

---

## 9. Wireframe Teks

## 9.1 Dashboard

```text
+------------------------------------------------+
| LaporKursus                                    |
| Dashboard | Siswa | Kelas | Absensi | SPP ... |
+------------------------------------------------+
| Siswa Aktif | Hadir Hari Ini | Telat | Alpa   |
|     48      |       36       |   5   |   4    |
+------------------------------------------------+
| SPP Belum Lunas        | Project Perlu Update   |
| 12 siswa               | 8 project              |
+------------------------------------------------+
| Quick Action:                                  |
| [Input Absensi] [Input Pembayaran] [Laporan]   |
+------------------------------------------------+
| Aktivitas Terbaru                              |
| - Ahmad ditandai Telat                         |
| - Nabila membayar SPP Juni                     |
+------------------------------------------------+
```

## 9.2 Absensi

```text
+------------------------------------------------+
| Absensi                                        |
+------------------------------------------------+
| Kelas: [Coding Kids A] Tanggal: [08/06/2026]   |
+------------------------------------------------+
| Nama Siswa      | H | A | I | T | Catatan      |
| Ahmad           | o | o | o | o | [........]   |
| Nabila          | o | o | o | o | [........]   |
| Fajar           | o | o | o | o | [........]   |
+------------------------------------------------+
| [Simpan Absensi]                               |
+------------------------------------------------+
```

## 9.3 SPP Bulanan

```text
+------------------------------------------------+
| SPP Bulanan                                    |
+------------------------------------------------+
| Bulan: [Juni] Tahun: [2026] Status: [Semua]    |
+------------------------------------------------+
| Nama     | Nominal | Dibayar | Status | Aksi     |
| Ahmad    | 150.000 | 0       | Belum  | [Ingat]  |
| Nabila   | 150.000 | 150.000 | Lunas  | [Bukti]  |
+------------------------------------------------+
| [Generate Tagihan] [Export]                    |
+------------------------------------------------+
```

## 9.4 Project Siswa

```text
+------------------------------------------------+
| Project Siswa                                  |
+------------------------------------------------+
| Kelas: [Web Basic] Siswa: [Ahmad]              |
+------------------------------------------------+
| Project: Website Portofolio                    |
| Status: [Proses] Progress: [70%]               |
| Link: https://...                              |
+------------------------------------------------+
| Catatan Pengajar                               |
| [Struktur halaman sudah baik...]               |
| Target Berikutnya                              |
| [Tambahkan halaman kontak...]                  |
+------------------------------------------------+
| [Simpan Laporan] [Kirim ke WA]                 |
+------------------------------------------------+
```

---

## 10. Arsitektur Teknis

## 10.1 Stack

### Frontend

- Vite + React + TypeScript.
- Tailwind CSS.
- Shadcn UI atau komponen custom.
- React Router.

### Backend

- Cloudflare Pages Functions untuk API.
- Cloudflare D1 sebagai database SQL serverless.
- Cloudflare Pages untuk hosting frontend.

### Tooling

- Wrangler CLI untuk local development, deploy, binding, dan migrasi database.
- SQL migration files untuk versioning schema.

## 10.2 Alasan Memilih Cloudflare Pages + D1

1. Cocok untuk web app ringan hingga menengah.
2. Hosting frontend dan backend berada dalam ekosistem Cloudflare.
3. D1 adalah database SQL serverless berbasis SQLite semantics.
4. Pages Functions dapat digunakan untuk API seperti login, absensi, pembayaran, dan laporan.
5. Biaya awal dapat ditekan karena tidak perlu VPS sendiri.

---

## 11. Struktur Folder yang Disarankan

```text
lapor-kursus/
├── functions/
│   └── api/
│       ├── auth/
│       ├── students/
│       ├── classes/
│       ├── attendance/
│       ├── fees/
│       ├── projects/
│       └── reports/
├── migrations/
│   ├── 0001_initial.sql
│   ├── 0002_add_indexes.sql
│   └── 0003_seed_default_templates.sql
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   ├── hooks/
│   └── types/
├── public/
├── package.json
├── wrangler.toml
└── README.md
```

---

## 12. Database Design

## 12.1 Tabel users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 12.2 Tabel programs

```sql
CREATE TABLE programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  default_fee INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 12.3 Tabel classes

```sql
CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  teacher_id TEXT,
  name TEXT NOT NULL,
  day_name TEXT,
  start_time TEXT,
  end_time TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (teacher_id) REFERENCES users(id)
);
```

## 12.4 Tabel students

```sql
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  class_id TEXT,
  program_id TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  join_date TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'leave', 'inactive')),
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (program_id) REFERENCES programs(id)
);
```

## 12.5 Tabel attendance

```sql
CREATE TABLE attendance (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  attendance_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('H', 'A', 'I', 'T')),
  late_minutes INTEGER DEFAULT 0,
  note TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  UNIQUE(student_id, class_id, attendance_date)
);
```

## 12.6 Tabel monthly_fees

```sql
CREATE TABLE monthly_fees (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid', 'waived')),
  due_date TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  UNIQUE(student_id, month, year)
);
```

## 12.7 Tabel payments

```sql
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  monthly_fee_id TEXT NOT NULL,
  payment_date TEXT NOT NULL,
  amount INTEGER NOT NULL,
  method TEXT NOT NULL DEFAULT 'cash' CHECK (method IN ('cash', 'transfer', 'qris', 'other')),
  note TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (monthly_fee_id) REFERENCES monthly_fees(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

## 12.8 Tabel student_projects

```sql
CREATE TABLE student_projects (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_date TEXT,
  target_date TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'revision', 'done')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  project_link TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);
```

## 12.9 Tabel project_reports

```sql
CREATE TABLE project_reports (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  report_date TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'revision', 'done')),
  teacher_note TEXT,
  next_target TEXT,
  feedback TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES student_projects(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

## 12.10 Tabel message_templates

```sql
CREATE TABLE message_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('schedule', 'absence', 'late', 'fee', 'project', 'general')),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 12.11 Tabel message_logs

```sql
CREATE TABLE message_logs (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  template_id TEXT,
  recipient_phone TEXT,
  message_type TEXT,
  message_content TEXT,
  channel TEXT NOT NULL DEFAULT 'whatsapp_link',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'opened', 'sent_manual')),
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (template_id) REFERENCES message_templates(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

## 12.12 Index yang Disarankan

```sql
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_program_id ON students(program_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, attendance_date);
CREATE INDEX idx_monthly_fees_student_id ON monthly_fees(student_id);
CREATE INDEX idx_monthly_fees_month_year ON monthly_fees(month, year);
CREATE INDEX idx_payments_fee_id ON payments(monthly_fee_id);
CREATE INDEX idx_projects_student_id ON student_projects(student_id);
CREATE INDEX idx_project_reports_project_id ON project_reports(project_id);
```

---

## 13. API Specification

Base path:

```text
/api
```

## 13.1 Auth

### POST /api/auth/login

Request:

```json
{
  "email": "admin@kursus.com",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "usr_001",
    "name": "Admin Kursus",
    "email": "admin@kursus.com",
    "role": "admin"
  },
  "token": "session-token"
}
```

### POST /api/auth/logout

Menghapus sesi user.

---

## 13.2 Students

### GET /api/students

Query opsional:

```text
?class_id=&program_id=&status=&search=
```

### POST /api/students

Membuat siswa baru.

### GET /api/students/:id

Melihat detail siswa.

### PUT /api/students/:id

Mengubah data siswa.

### DELETE /api/students/:id

Soft delete atau ubah status menjadi nonaktif.

---

## 13.3 Classes

### GET /api/classes

Menampilkan daftar kelas.

### POST /api/classes

Membuat kelas baru.

### PUT /api/classes/:id

Mengubah kelas.

---

## 13.4 Attendance

### GET /api/attendance

Query:

```text
?class_id=&date=&month=&year=&student_id=
```

### POST /api/attendance/bulk

Request:

```json
{
  "class_id": "cls_001",
  "attendance_date": "2026-06-08",
  "records": [
    {
      "student_id": "std_001",
      "status": "H",
      "late_minutes": 0,
      "note": ""
    },
    {
      "student_id": "std_002",
      "status": "T",
      "late_minutes": 20,
      "note": "Datang terlambat"
    }
  ]
}
```

### GET /api/attendance/summary

Query:

```text
?class_id=&month=&year=
```

Response:

```json
{
  "class_id": "cls_001",
  "month": 6,
  "year": 2026,
  "students": [
    {
      "student_id": "std_001",
      "name": "Ahmad",
      "H": 7,
      "A": 1,
      "I": 0,
      "T": 2,
      "warning": "sering_telat"
    }
  ]
}
```

---

## 13.5 Monthly Fees

### GET /api/fees

Query:

```text
?month=&year=&status=&student_id=
```

### POST /api/fees/generate

Generate tagihan untuk bulan tertentu.

Request:

```json
{
  "month": 6,
  "year": 2026,
  "class_id": "cls_001"
}
```

### POST /api/fees/:id/payments

Input pembayaran.

Request:

```json
{
  "payment_date": "2026-06-08",
  "amount": 150000,
  "method": "cash",
  "note": "Lunas"
}
```

### GET /api/fees/summary

Rekap pembayaran bulanan.

---

## 13.6 Projects

### GET /api/projects

Query:

```text
?student_id=&class_id=&status=
```

### POST /api/projects

Membuat project siswa.

### PUT /api/projects/:id

Mengubah project.

### POST /api/projects/:id/reports

Menambah laporan project.

### GET /api/projects/:id/reports

Melihat riwayat laporan project.

---

## 13.7 Messages

### GET /api/message-templates

Melihat template pesan.

### POST /api/message-templates

Membuat template pesan.

### POST /api/messages/preview

Membuat preview pesan berdasarkan template.

Request:

```json
{
  "template_id": "tpl_fee_001",
  "student_id": "std_001",
  "context": {
    "month": "Juni",
    "year": 2026
  }
}
```

Response:

```json
{
  "message": "Assalamu’alaikum Bapak/Ibu...",
  "whatsapp_url": "https://wa.me/628xxxxxxxxxx?text=..."
}
```

---

## 14. Non-Functional Requirements

## 14.1 Performance

1. Dashboard harus terbuka kurang dari 3 detik pada koneksi normal.
2. Input absensi satu kelas harus dapat disimpan dalam satu request bulk.
3. Daftar siswa harus mendukung pencarian cepat.
4. Query rekap bulanan harus menggunakan index.

## 14.2 Security

1. Password harus disimpan dalam bentuk hash, bukan plain text.
2. API harus memvalidasi role user.
3. Admin hanya boleh mengakses data kursusnya sendiri jika nanti mendukung multi-tenant.
4. Input user harus divalidasi untuk mencegah data rusak.
5. Session token disimpan secara aman.
6. Endpoint sensitif harus memerlukan autentikasi.

## 14.3 Reliability

1. Data absensi tidak boleh duplikat untuk siswa, kelas, dan tanggal yang sama.
2. Generate tagihan bulanan harus idempotent: tidak membuat tagihan ganda.
3. Pembayaran harus memperbarui status tagihan secara konsisten.
4. Error harus ditampilkan dengan pesan yang jelas.

## 14.4 Usability

1. UI harus sederhana dan mudah digunakan dari laptop maupun HP.
2. Input absensi harus bisa dilakukan dengan sedikit klik.
3. Admin dapat menemukan siswa dengan pencarian.
4. Status pembayaran harus mudah dibedakan secara visual.
5. Laporan project harus mudah dibaca orang tua.

## 14.5 Data Export

1. Laporan absensi dapat diekspor ke CSV/XLSX.
2. Laporan SPP dapat diekspor ke CSV/XLSX.
3. Laporan project dapat diekspor minimal CSV pada MVP.

---

## 15. Rencana Implementasi Teknis Cloudflare

## 15.1 Konfigurasi D1 Binding

Binding database disarankan menggunakan nama:

```text
DB
```

Contoh `wrangler.toml`:

```toml
name = "lapor-kursus"
compatibility_date = "2026-06-08"
pages_build_output_dir = "dist"

[[d1_databases]]
binding = "DB"
database_name = "lapor-kursus-db"
database_id = "isi-dengan-database-id"
```

## 15.2 Akses D1 dari Pages Functions

Contoh konsep akses database:

```ts
export async function onRequestGet(context) {
  const { env } = context;
  const result = await env.DB.prepare(
    "SELECT * FROM students ORDER BY name ASC"
  ).all();

  return Response.json(result);
}
```

## 15.3 Migrasi Database

Gunakan folder:

```text
migrations/
```

Contoh urutan:

1. `0001_initial.sql`
2. `0002_add_indexes.sql`
3. `0003_seed_message_templates.sql`

---

## 16. Sprint Breakdown

## Sprint 1 — Fondasi Project

Durasi estimasi: 1 minggu

Output:

1. Setup Vite React TypeScript.
2. Setup Tailwind CSS.
3. Setup Cloudflare Pages.
4. Setup Pages Functions.
5. Setup D1 database.
6. Setup migration awal.
7. Layout dasar aplikasi.
8. Login sederhana.

## Sprint 2 — Master Data

Output:

1. CRUD program kursus.
2. CRUD kelas.
3. CRUD siswa.
4. Profil siswa.
5. Filter dan pencarian siswa.

## Sprint 3 — Absensi

Output:

1. Input absensi bulk.
2. Edit absensi.
3. Rekap absensi harian.
4. Rekap absensi bulanan.
5. Warning siswa sering alpa/telat.

## Sprint 4 — SPP Bulanan

Output:

1. Generate tagihan bulanan.
2. Input pembayaran.
3. Status belum lunas/sebagian/lunas.
4. Daftar tunggakan.
5. Rekap pemasukan.

## Sprint 5 — Pesan WhatsApp

Output:

1. Template pesan.
2. Preview pesan.
3. Generate link WhatsApp.
4. Log pesan.
5. Pengingat jadwal, absensi, dan SPP.

## Sprint 6 — Project Siswa dan Laporan

Output:

1. CRUD project siswa.
2. Input laporan progress.
3. Riwayat laporan project.
4. Kirim laporan project via WhatsApp.
5. Export laporan.

## Sprint 7 — Polishing dan Deploy

Output:

1. Perbaikan UI responsive.
2. Testing role.
3. Testing data dummy.
4. Testing deploy Cloudflare Pages.
5. Dokumentasi penggunaan.

---

## 17. Success Metrics

Produk dianggap berhasil jika:

1. Admin dapat menginput absensi satu kelas dalam waktu kurang dari 2 menit.
2. Admin dapat melihat siswa belum bayar SPP dalam 1 halaman.
3. Pengajar dapat membuat laporan project siswa dengan mudah.
4. Minimal 90% data absensi dan SPP tersimpan rapi selama satu bulan penggunaan.
5. Admin tidak perlu lagi membuat rekap manual dari awal.
6. Pengingat WhatsApp dapat dibuat otomatis dari template.

---

## 18. Edge Cases

1. Siswa pindah kelas di tengah bulan.
2. Siswa cuti sementara.
3. Siswa membayar SPP sebagian.
4. Siswa membayar lebih dari nominal tagihan.
5. Admin salah input absensi.
6. Absensi sudah dibuat tetapi perlu diedit.
7. Tagihan bulan yang sama sudah pernah digenerate.
8. Nomor WhatsApp kosong atau tidak valid.
9. Project siswa belum punya link.
10. Pengajar lupa mengisi laporan project.

---

## 19. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Admin belum terbiasa memakai aplikasi | Data tidak konsisten | UI sederhana dan dokumentasi singkat |
| Nomor WhatsApp tidak valid | Pesan gagal dikirim | Validasi format nomor |
| Tagihan ganda | Data pembayaran kacau | Unique constraint student_id, month, year |
| Absensi ganda | Rekap salah | Unique constraint student_id, class_id, attendance_date |
| Data project jarang diupdate | Laporan kurang berguna | Tampilkan reminder project perlu update |
| Akses role tidak rapi | Data sensitif terlihat | Middleware auth dan role guard |

---

## 20. Roadmap Setelah MVP

## Fase 2

1. Login siswa/orang tua.
2. Portal laporan siswa.
3. PDF report per siswa.
4. Upload bukti pembayaran.
5. Upload gambar project.
6. Multi-cabang kursus.

## Fase 3

1. Integrasi WhatsApp API resmi.
2. Payment gateway/QRIS otomatis.
3. Notifikasi otomatis.
4. Sertifikat otomatis untuk project selesai.
5. Analitik performa siswa.
6. Sistem paket kursus dan diskon.

---

## 21. Prompt Awal untuk Codex

```text
Anda adalah senior full-stack developer. Bangun web app bernama LaporKursus berdasarkan PRD ini.

Stack:
- Vite + React + TypeScript
- Tailwind CSS
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare D1
- Wrangler untuk binding dan migrasi database

Prioritas MVP:
1. Login admin/pengajar sederhana.
2. CRUD siswa, program, dan kelas.
3. Input absensi H, A, I, T secara bulk per kelas dan tanggal.
4. Rekap absensi bulanan.
5. Generate tagihan SPP bulanan.
6. Input pembayaran SPP.
7. Template pesan dan generate link WhatsApp.
8. Laporan project siswa.
9. Dashboard ringkas.
10. Export CSV/XLSX.

Gunakan struktur folder yang rapi:
- /src untuk frontend
- /functions/api untuk backend Cloudflare Pages Functions
- /migrations untuk SQL D1

Pastikan:
- Semua API menggunakan validasi input.
- Role admin dan teacher dibedakan.
- Absensi tidak boleh duplikat untuk siswa, kelas, dan tanggal yang sama.
- Tagihan tidak boleh duplikat untuk siswa, bulan, dan tahun yang sama.
- UI responsive untuk laptop dan HP.
- Desain clean, ringan, dan mudah digunakan admin kursus.

Mulai dari setup project, schema D1, lalu implementasi modul secara bertahap sesuai sprint.
```

---

## 22. Catatan Keputusan Produk

1. MVP tidak memakai WhatsApp API agar biaya awal rendah dan implementasi cepat.
2. Pengiriman pesan dilakukan melalui link WhatsApp yang dibuat otomatis dari template.
3. D1 dipilih karena cocok untuk aplikasi operasional ringan yang membutuhkan database SQL serverless.
4. Cloudflare Pages Functions digunakan sebagai backend API agar frontend dan backend berada dalam satu ekosistem deploy.
5. Login siswa/orang tua ditunda agar MVP tidak terlalu kompleks.
6. Fokus utama adalah membantu admin dan pengajar bekerja lebih rapi, bukan membuat LMS penuh.

---

## 23. Referensi Teknis

- Cloudflare D1 adalah database SQL serverless terkelola dengan SQLite semantics, disaster recovery, serta akses melalui Workers dan HTTP API.
- Cloudflare Pages Functions dapat digunakan untuk membuat backend/API di atas jaringan Cloudflare Workers.
- D1 database dapat di-bind ke Pages Functions melalui dashboard Cloudflare atau konfigurasi Wrangler.
- Migrasi D1 dapat dikelola menggunakan file SQL migration dan Wrangler.

---

## 24. Kesimpulan

LaporKursus adalah web app yang realistis untuk dibangun sebagai MVP dengan Cloudflare Pages + D1. Fitur utamanya sederhana tetapi langsung menyelesaikan masalah operasional kursus: absensi, pengingat siswa, SPP bulanan, dan laporan project siswa.

Dengan pendekatan bertahap, produk ini dapat mulai digunakan secara internal terlebih dahulu, lalu dikembangkan menjadi sistem yang lebih lengkap untuk banyak lembaga kursus.
