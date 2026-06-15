export const students = [
  'Andi Wijaya',
  'Budi Santoso',
  'Citra Lestari',
  'Dewi Puspita',
  'Eko Prasetyo',
  'Fajar Nugroho',
  'Gita Maharani',
  'Hendra Setiawan',
  'Siti Aisyah',
  'Nabila Putri',
];

export const activityRows = [
  ['09:15', 'Absensi diisi', 'Kelas Web Development - Pagi', 'Bu Rina'],
  ['09:05', 'Pembayaran SPP', 'Budi Santoso - Mei 2024', 'Admin'],
  ['08:30', 'Project diunggah', 'UI/UX Design - Wireframe', 'Andi Wijaya'],
  ['08:20', 'Pesan pengingat dikirim', 'Pengingat SPP Bulan Mei', 'Admin'],
  ['08:10', 'Siswa baru ditambahkan', 'Siti Aisyah - Kelas English', 'Admin'],
];

export const attendanceStudents = [
  ['1', 'Andi Wijaya', 'H', 'Hadir', '-'],
  ['2', 'Budi Santoso', 'H', 'Hadir', '-'],
  ['3', 'Citra Lestari', 'T', 'Telat', '09:15'],
  ['4', 'Dewi Puspita', 'I', 'Izin', 'Sakit'],
  ['5', 'Eko Prasetyo', 'A', 'Alpa', '-'],
  ['6', 'Fajar Nugroho', 'H', 'Hadir', '-'],
  ['7', 'Gita Maharani', 'I', 'Izin', 'Keperluan keluarga'],
  ['8', 'Hendra Setiawan', 'H', 'Hadir', '-'],
];

export const billingItems = [
  ['1', 'Andi Wijaya', 'Web Dev - Pagi', 'Mei 2024', 'Rp 1.000.000', 'Lunas', 'Lihat'],
  ['2', 'Budi Santoso', 'Web Dev - Pagi', 'Mei 2024', 'Rp 1.000.000', 'Belum Lunas', 'Tagih'],
  ['3', 'Citra Lestari', 'UI/UX Design', 'Mei 2024', 'Rp 1.000.000', 'Sebagian', 'Lihat'],
  ['4', 'Dewi Puspita', 'Digital Marketing', 'Mei 2024', 'Rp 1.000.000', 'Lunas', 'Lihat'],
  ['5', 'Eko Prasetyo', 'Web Dev - Malam', 'Mei 2024', 'Rp 1.000.000', 'Belum Lunas', 'Tagih'],
];

export const projectItems = [
  ['1', 'Andi Wijaya', 'Redesign Landing Page', 75, 'blue', 'Proses', 'Bu Rina', '25 Mei 2024'],
  ['2', 'Citra Lestari', 'Mobile App UI', 40, 'orange', 'Revisi', 'Pak Dimas', '22 Mei 2024'],
  ['3', 'Dewi Puspita', 'User Flow & Wireframe', 90, 'blue', 'Proses', 'Bu Rina', '20 Mei 2024'],
  ['4', 'Eko Prasetyo', 'Dashboard Admin', 100, 'green', 'Selesai', 'Pak Dimas', '18 Mei 2024'],
];

export const messageTemplates = [
  ['Pengingat Kehadiran', 'Pengingat untuk siswa yang sering tidak hadir'],
  ['Pengingat SPP', 'Pengingat pembayaran SPP bulanan'],
  ['Pengingat Project', 'Pengingat deadline atau review project'],
  ['Pengumuman Kelas', 'Informasi umum untuk siswa'],
];

export const reminderMessage = `Halo {nama_siswa},

Kami mencatat Anda belum hadir di beberapa pertemuan.
Mohon untuk lebih memperhatikan kehadiran agar tidak
mengganggu proses belajar Anda.

Terima kasih atas perhatiannya.

Salam,
Tim {nama_kursus}`;
