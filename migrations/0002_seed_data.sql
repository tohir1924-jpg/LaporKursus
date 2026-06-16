-- Migration: 0002_seed_data.sql
-- Description: Seed data for development and testing

-- 1. Seed Users (passwords are plain 'password' hashes or dummy values for development)
-- In production, these should be properly hashed passwords (e.g. bcrypt/scrypt)
INSERT OR IGNORE INTO users (id, name, email, password_hash, role, status) VALUES
('usr_admin', 'Admin Kursus', 'admin@kursus.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active'),
('usr_teacher1', 'Bu Rina', 'rina@kursus.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'active'),
('usr_teacher2', 'Pak Dimas', 'dimas@kursus.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'active');

-- 2. Seed Programs
INSERT OR IGNORE INTO programs (id, name, description, default_fee, status) VALUES
('prog_webdev', 'Web Development', 'Belajar membuat website modern menggunakan HTML, CSS, JavaScript, dan React', 1000000, 'active'),
('prog_uiux', 'UI/UX Design', 'Mendesain antarmuka dan pengalaman pengguna yang menarik untuk web & mobile', 1000000, 'active'),
('prog_digimar', 'Digital Marketing', 'Strategi pemasaran digital, SEO, SEM, dan manajemen media sosial', 1000000, 'active'),
('prog_english', 'English Course', 'Belajar percakapan dan tata bahasa Inggris untuk akademisi dan profesional', 500000, 'active');

-- 3. Seed Classes
INSERT OR IGNORE INTO classes (id, program_id, teacher_id, name, day_name, start_time, end_time, status) VALUES
('cls_webdev_pagi', 'prog_webdev', 'usr_teacher1', 'Web Dev - Pagi', 'Senin & Rabu', '08:00', '10:00', 'active'),
('cls_webdev_malam', 'prog_webdev', 'usr_teacher2', 'Web Dev - Malam', 'Selasa & Kamis', '19:00', '21:00', 'active'),
('cls_uiux', 'prog_uiux', 'usr_teacher2', 'UI/UX Design', 'Jumat', '13:00', '16:00', 'active');

-- 4. Seed Students
INSERT OR IGNORE INTO students (id, class_id, program_id, name, phone, guardian_name, guardian_phone, join_date, status, note) VALUES
('std_001', 'cls_webdev_pagi', 'prog_webdev', 'Andi Wijaya', '081234567890', 'Bapak Wijaya', '081234567891', '2026-01-10', 'active', 'Butuh perhatian lebih pada JavaScript dasar'),
('std_002', 'cls_webdev_pagi', 'prog_webdev', 'Budi Santoso', '082234567890', 'Bapak Santoso', '082234567891', '2026-01-12', 'active', NULL),
('std_003', 'cls_uiux', 'prog_uiux', 'Citra Lestari', '083234567890', 'Ibu Lestari', '083234567891', '2026-02-01', 'active', 'Sangat baik di Figma'),
('std_004', 'cls_webdev_malam', 'prog_webdev', 'Dewi Puspita', '084234567890', 'Bapak Puspita', '084234567891', '2026-02-15', 'active', NULL),
('std_005', 'cls_webdev_malam', 'prog_webdev', 'Eko Prasetyo', '085234567890', 'Ibu Prasetyo', '085234567891', '2026-02-20', 'active', NULL),
('std_006', 'cls_webdev_pagi', 'prog_webdev', 'Fajar Nugroho', '086234567890', 'Bapak Nugroho', '086234567891', '2026-03-01', 'active', NULL),
('std_007', 'cls_uiux', 'prog_uiux', 'Gita Maharani', '087234567890', 'Ibu Maharani', '087234567891', '2026-03-05', 'active', NULL),
('std_008', 'cls_webdev_pagi', 'prog_webdev', 'Hendra Setiawan', '088234567890', 'Bapak Setiawan', '088234567891', '2026-03-10', 'active', NULL),
('std_009', 'cls_webdev_pagi', 'prog_webdev', 'Siti Aisyah', '089234567890', 'Ibu Aisyah', '089234567891', '2026-03-15', 'active', NULL),
('std_010', 'cls_webdev_pagi', 'prog_webdev', 'Nabila Putri', '089934567890', 'Bapak Putri', '089934567891', '2026-03-18', 'active', NULL);

-- 5. Seed Message Templates
INSERT OR IGNORE INTO message_templates (id, name, type, content, status) VALUES
('tpl_001', 'Pengingat Jadwal', 'schedule', 'Assalamu’alaikum, {{nama_siswa}}. Mengingatkan bahwa jadwal kursus {{nama_program}} hari ini pukul {{jam_mulai}} WIB. Mohon hadir tepat waktu. Terima kasih.', 'active'),
('tpl_002', 'Pengingat Kehadiran', 'absence', 'Halo {{nama_siswa}}, kami mencatat Anda tidak hadir pada pertemuan kelas {{nama_kelas}} tanggal {{tanggal}}. Mohon konfirmasi kehadirannya. Terima kasih. - Tim {{nama_kursus}}', 'active'),
('tpl_003', 'Pengingat SPP', 'fee', 'Assalamu’alaikum Bapak/Ibu {{nama_wali}}. Kami mengingatkan bahwa tagihan SPP bulan {{bulan}} {{tahun}} atas nama {{nama_siswa}} sebesar {{nominal_spp}} belum tercatat lunas. Silakan melakukan pembayaran. Terima kasih.', 'active'),
('tpl_004', 'Pengingat Project', 'project', 'Halo {{nama_siswa}}, project {{judul_project}} Anda saat ini berada di progress {{progress}}% dengan status {{status_project}}. Mohon untuk melengkapi bagian {{catatan_project}} sebelum deadline {{tanggal}}. Semangat! - Mentor {{nama_pengajar}}', 'active'),
('tpl_005', 'Pengumuman Kelas', 'general', 'Informasi Penting untuk seluruh siswa kelas {{nama_kelas}}: {{pesan_tambahan}}. Terima kasih atas perhatiannya.', 'active');

