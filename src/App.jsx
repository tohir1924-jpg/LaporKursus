import { useMemo, useState } from 'react';
import {
  Bell,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileBarChart,
  FileCheck2,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Siswa', icon: Users },
  { id: 'classes', label: 'Kelas', icon: BookOpen },
  { id: 'attendance', label: 'Absensi', icon: CalendarCheck },
  { id: 'billing', label: 'SPP Bulanan', icon: Wallet },
  { id: 'reminders', label: 'Pesan Pengingat', icon: MessageCircle },
  { id: 'projects', label: 'Project Siswa', icon: FolderKanban },
  { id: 'reports', label: 'Laporan', icon: FileBarChart },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
];

const students = [
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

const accentMap = {
  blue: { icon: 'bg-blue-100 text-blue-700', text: 'text-blue-700', bar: 'bg-blue-600' },
  green: { icon: 'bg-green-100 text-green-700', text: 'text-green-700', bar: 'bg-green-500' },
  orange: { icon: 'bg-orange-100 text-orange-700', text: 'text-orange-700', bar: 'bg-orange-500' },
  purple: { icon: 'bg-purple-100 text-purple-700', text: 'text-purple-700', bar: 'bg-purple-500' },
  red: { icon: 'bg-red-100 text-red-700', text: 'text-red-700', bar: 'bg-red-500' },
  teal: { icon: 'bg-teal-100 text-teal-700', text: 'text-teal-700', bar: 'bg-teal-500' },
  slate: { icon: 'bg-slate-100 text-slate-700', text: 'text-slate-700', bar: 'bg-slate-500' },
};

const statusStyles = {
  H: 'bg-green-100 text-green-700 border-green-200',
  A: 'bg-red-100 text-red-700 border-red-200',
  I: 'bg-blue-100 text-blue-700 border-blue-200',
  T: 'bg-orange-100 text-orange-700 border-orange-200',
  Lunas: 'bg-green-100 text-green-700 border-green-200',
  'Belum Lunas': 'bg-red-100 text-red-700 border-red-200',
  Sebagian: 'bg-orange-100 text-orange-700 border-orange-200',
  Proses: 'bg-blue-100 text-blue-700 border-blue-200',
  Revisi: 'bg-orange-100 text-orange-700 border-orange-200',
  Selesai: 'bg-green-100 text-green-700 border-green-200',
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [profileTab, setProfileTab] = useState('Ringkasan');

  const pageTitle = useMemo(() => {
    if (activePage === 'profile') return 'Profil Siswa';
    return navItems.find((item) => item.id === activePage)?.label ?? 'Dashboard';
  }, [activePage]);

  return (
    <AppShell
      activePage={activePage}
      pageTitle={pageTitle}
      onNavigate={setActivePage}
    >
      {activePage === 'dashboard' && <DashboardPage />}
      {activePage === 'attendance' && <AttendancePage />}
      {activePage === 'billing' && <BillingPage />}
      {activePage === 'reminders' && <ReminderPage />}
      {activePage === 'projects' && <ProjectsPage onOpenProfile={() => setActivePage('profile')} />}
      {activePage === 'profile' && <StudentProfilePage activeTab={profileTab} setActiveTab={setProfileTab} />}
      {['students', 'classes', 'reports', 'settings'].includes(activePage) && (
        <PlaceholderPage title={pageTitle} />
      )}
    </AppShell>
  );
}

function AppShell({ activePage, pageTitle, onNavigate, children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="min-h-screen lg:pl-[260px]">
        <Topbar pageTitle={pageTitle} />
        <main className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <button
        type="button"
        onClick={() => onNavigate('dashboard')}
        className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-soft">
          <GraduationCap size={24} />
        </span>
        <span>
          <span className="block text-lg font-bold text-slate-950">LaporKursus</span>
          <span className="block text-xs font-medium text-teal-600">Manajemen kursus</span>
        </span>
      </button>

      <nav className="mt-7 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-5 left-4 right-4 rounded-2xl border border-teal-100 bg-teal-50 p-4">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700">
          <Sparkles size={18} />
        </div>
        <p className="text-sm font-semibold text-slate-900">Siap Cloudflare D1</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">UI sudah disiapkan untuk data API dan binding backend nanti.</p>
      </div>
    </aside>
  );
}

function Topbar({ pageTitle }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#F8FAFC]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">LaporKursus</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-[30px]">{pageTitle}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <label className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="Cari siswa, kelas, atau menu..."
            />
          </label>
          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50" aria-label="Notifikasi">
            <Bell size={19} />
          </button>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-sm font-bold text-white">
              AK
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-4 text-slate-900">Admin Kursus</p>
              <p className="mt-1 text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function SectionCard({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function StatCard({ title, value, subtext, icon: Icon, accent }) {
  const colors = accentMap[accent];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
          <p className={`mt-2 text-sm font-medium ${colors.text}`}>{subtext}</p>
        </div>
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colors.icon}`}>
          <Icon size={23} />
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ value }) {
  return (
    <span className={`inline-flex min-w-9 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[value] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {value}
    </span>
  );
}

function ProgressBar({ value, accent = 'blue' }) {
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${accentMap[accent].bar}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, index) => (
            <tr key={index} className="transition hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="whitespace-nowrap px-4 py-4 text-slate-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SelectBox({ children }) {
  return (
    <button className="inline-flex h-11 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
      <span>{children}</span>
      <ChevronDown size={16} className="text-slate-400" />
    </button>
  );
}

function PrimaryButton({ children, icon: Icon, color = 'blue' }) {
  const styles = color === 'green' ? 'bg-green-500 hover:bg-green-600 focus:ring-green-100' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-100';
  return (
    <button className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 ${styles}`}>
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

function DashboardPage() {
  const activityRows = [
    ['09:15', 'Absensi diisi', 'Kelas Web Development - Pagi', 'Bu Rina'],
    ['09:05', 'Pembayaran SPP', 'Budi Santoso - Mei 2024', 'Admin'],
    ['08:30', 'Project diunggah', 'UI/UX Design - Wireframe', 'Andi Wijaya'],
    ['08:20', 'Pesan pengingat dikirim', 'Pengingat SPP Bulan Mei', 'Admin'],
    ['08:10', 'Siswa baru ditambahkan', 'Siti Aisyah - Kelas English', 'Admin'],
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">Aplikasi Manajemen Kursus & Pelaporan Terpadu</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Kelola data siswa, absensi, pembayaran, project, dan laporan dengan mudah dalam satu platform.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Siswa Aktif" value="128" subtext="↑ 8 dari bulan lalu" icon={Users} accent="blue" />
        <StatCard title="Hadir Hari Ini" value="96" subtext="75% dari total siswa" icon={UserCheck} accent="green" />
        <StatCard title="SPP Belum Lunas" value="28" subtext="Rp 14.750.000" icon={CreditCard} accent="orange" />
        <StatCard title="Project Perlu Review" value="17" subtext="Perlu perhatian mentor" icon={FileCheck2} accent="purple" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <AttendanceChart />
        <ReminderList />
      </div>
      <SectionCard title="Aktivitas Hari Ini">
        <DataTable columns={['Waktu', 'Aktivitas', 'Detail', 'Oleh']} rows={activityRows} />
      </SectionCard>
    </div>
  );
}

function AttendanceChart() {
  const points = [
    [44, 144],
    [128, 130],
    [212, 64],
    [296, 52],
    [380, 113],
    [464, 70],
    [548, 105],
  ];
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' ');

  return (
    <SectionCard title="Ringkasan Kehadiran (7 Hari Terakhir)">
      <div className="relative overflow-hidden rounded-2xl bg-slate-50 px-2 py-4">
        <svg viewBox="0 0 600 230" className="h-[260px] w-full">
          {[20, 67, 114, 161, 208].map((y, index) => (
            <g key={y}>
              <line x1="44" x2="570" y1={y} y2={y} stroke="#E5E7EB" />
              <text x="4" y={y + 4} fontSize="11" fill="#64748B">{[100, 75, 50, 25, 0][index]}%</text>
            </g>
          ))}
          <path d={path} fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {points.map(([x, y], index) => (
            <circle key={x} cx={x} cy={y} r="6" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3" />
          ))}
          {['13 Mei', '14 Mei', '15 Mei', '16 Mei', '17 Mei', '18 Mei', '19 Mei'].map((label, index) => (
            <text key={label} x={points[index][0] - 18} y="224" fontSize="12" fill="#64748B">{label}</text>
          ))}
        </svg>
        <div className="absolute left-[61%] top-[31%] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-soft">
          <p className="font-semibold text-slate-900">17 Mei</p>
          <p className="mt-1 text-slate-600">Kehadiran: 78%</p>
        </div>
      </div>
    </SectionCard>
  );
}

function ReminderList() {
  const reminders = [
    ['SPP Bulan Mei jatuh tempo', '5 siswa belum membayar', '09:30', Wallet, 'orange'],
    ['Absensi belum diisi', '2 kelas hari ini belum diisi', '08:45', CalendarCheck, 'blue'],
    ['Project perlu review', '17 project menunggu review', '08:30', FolderKanban, 'purple'],
    ['Kelas akan dimulai', 'Desain Grafis - 10:00 WIB', '09:50', BookOpen, 'teal'],
  ];

  return (
    <SectionCard
      title="Pengingat"
      action={<button className="text-sm font-semibold text-blue-700 hover:text-blue-800">Lihat semua</button>}
    >
      <div className="space-y-3">
        {reminders.map(([title, subtitle, time, Icon, accent]) => (
          <div key={title} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3 transition hover:bg-slate-50">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentMap[accent].icon}`}>
              <Icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>
            <span className="text-xs font-medium text-slate-400">{time}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AttendancePage() {
  const rows = [
    ['1', 'Andi Wijaya', <StatusBadge value="H" />, 'Hadir', '-'],
    ['2', 'Budi Santoso', <StatusBadge value="H" />, 'Hadir', '-'],
    ['3', 'Citra Lestari', <StatusBadge value="T" />, 'Telat', '09:15'],
    ['4', 'Dewi Puspita', <StatusBadge value="I" />, 'Izin', 'Sakit'],
    ['5', 'Eko Prasetyo', <StatusBadge value="A" />, 'Alpa', '-'],
    ['6', 'Fajar Nugroho', <StatusBadge value="H" />, 'Hadir', '-'],
    ['7', 'Gita Maharani', <StatusBadge value="I" />, 'Izin', 'Keperluan keluarga'],
    ['8', 'Hendra Setiawan', <StatusBadge value="H" />, 'Hadir', '-'],
  ];

  return (
    <SectionCard title="Absensi Kehadiran">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SelectBox>Tanggal: 19 Mei 2024</SelectBox>
        <SelectBox>Kelas: Web Development - Pagi</SelectBox>
        <PrimaryButton icon={CheckCircle2}>Simpan Absensi</PrimaryButton>
      </div>
      <DataTable columns={['No', 'Nama Siswa', 'Kode', 'Status', 'Keterangan']} rows={rows} />
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        {['H = Hadir', 'A = Alpa', 'I = Izin', 'T = Telat'].map((item) => (
          <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-600">{item}</span>
        ))}
      </div>
    </SectionCard>
  );
}

function BillingPage() {
  const rows = [
    ['1', 'Andi Wijaya', 'Web Dev - Pagi', 'Mei 2024', 'Rp 1.000.000', <StatusBadge value="Lunas" />, <button className="font-semibold text-blue-700">Lihat</button>],
    ['2', 'Budi Santoso', 'Web Dev - Pagi', 'Mei 2024', 'Rp 1.000.000', <StatusBadge value="Belum Lunas" />, <button className="font-semibold text-red-600">Tagih</button>],
    ['3', 'Citra Lestari', 'UI/UX Design', 'Mei 2024', 'Rp 1.000.000', <StatusBadge value="Sebagian" />, <button className="font-semibold text-blue-700">Lihat</button>],
    ['4', 'Dewi Puspita', 'Digital Marketing', 'Mei 2024', 'Rp 1.000.000', <StatusBadge value="Lunas" />, <button className="font-semibold text-blue-700">Lihat</button>],
    ['5', 'Eko Prasetyo', 'Web Dev - Malam', 'Mei 2024', 'Rp 1.000.000', <StatusBadge value="Belum Lunas" />, <button className="font-semibold text-red-600">Tagih</button>],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid flex-1 gap-5 md:grid-cols-3">
          <StatCard title="Total Pemasukan (Mei 2024)" value="Rp 28.750.000" subtext="↑ 12% dari bulan lalu" icon={Wallet} accent="green" />
          <StatCard title="Total Tunggakan" value="Rp 14.750.000" subtext="28 siswa" icon={CreditCard} accent="orange" />
          <StatCard title="Persentase Lunas" value="65%" subtext="82 dari 128 siswa" icon={CheckCircle2} accent="blue" />
        </div>
      </div>
      <SectionCard
        title="Daftar SPP Bulanan"
        action={<PrimaryButton icon={FileBarChart}>Export Laporan</PrimaryButton>}
      >
        <div className="mb-5 flex flex-wrap gap-3">
          <SelectBox>Bulan: Mei 2024</SelectBox>
          <SelectBox>Kelas: Semua Kelas</SelectBox>
          <label className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Cari siswa..." />
          </label>
        </div>
        <DataTable columns={['No', 'Nama Siswa', 'Kelas', 'Bulan', 'Nominal', 'Status', 'Aksi']} rows={rows} />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">Menampilkan 1 - 5 dari 28 data</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <button key={page} className={`h-9 w-9 rounded-lg text-sm font-semibold ${page === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{page}</button>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function ReminderPage() {
  const templates = [
    ['Pengingat Kehadiran', 'Pengingat untuk siswa yang sering tidak hadir'],
    ['Pengingat SPP', 'Pengingat pembayaran SPP bulanan'],
    ['Pengingat Project', 'Pengingat deadline atau review project'],
    ['Pengumuman Kelas', 'Informasi umum untuk siswa'],
  ];
  const message = `Halo {nama_siswa},

Kami mencatat Anda belum hadir di beberapa pertemuan.
Mohon untuk lebih memperhatikan kehadiran agar tidak
mengganggu proses belajar Anda.

Terima kasih atas perhatiannya.

Salam,
Tim {nama_kursus}`;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr_1fr]">
      <SectionCard title="Pilih Template">
        <div className="space-y-3">
          {templates.map(([title, subtitle], index) => (
            <button key={title} className={`w-full rounded-2xl border p-4 text-left transition ${index === 0 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'}`}>
              <p className="font-semibold">{title}</p>
              <p className={`mt-1 text-sm ${index === 0 ? 'text-blue-600' : 'text-slate-500'}`}>{subtitle}</p>
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Editor Pesan">
        <label className="text-sm font-semibold text-slate-700">Pesan</label>
        <textarea className="mt-2 min-h-[300px] w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm leading-6 text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" defaultValue={message} />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-slate-500">176 / 500</p>
          <div className="flex flex-wrap justify-end gap-2">
            {['{nama_siswa}', '{nama_kursus}', '{kelas}', '{tanggal}'].map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item}</span>
            ))}
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Preview (WhatsApp)">
        <div className="rounded-2xl border border-green-100 bg-[#EEF8F1] p-4">
          <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-[#DCF8C6] p-4 text-sm leading-6 text-slate-800 shadow-sm">
            <p>Halo Andi Wijaya,</p>
            <p className="mt-3">Kami mencatat Anda belum hadir di beberapa pertemuan. Mohon untuk lebih memperhatikan kehadiran agar tidak mengganggu proses belajar Anda.</p>
            <p className="mt-3">Terima kasih atas perhatiannya.</p>
            <p className="mt-3">Salam,<br />Tim LaporKursus</p>
            <p className="mt-2 text-right text-xs text-slate-500">10:30 ✓✓</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <label className="text-sm font-semibold text-slate-700">Kirim ke</label>
          <SelectBox>Siswa yang dipilih (5)</SelectBox>
          <PrimaryButton icon={MessageCircle} color="green">Kirim WhatsApp</PrimaryButton>
        </div>
      </SectionCard>
    </div>
  );
}

function ProjectsPage({ onOpenProfile }) {
  const rows = [
    ['1', <button onClick={onOpenProfile} className="font-semibold text-blue-700">Andi Wijaya</button>, 'Redesign Landing Page', <ProjectProgress value={75} />, <StatusBadge value="Proses" />, 'Bu Rina', '25 Mei 2024'],
    ['2', 'Citra Lestari', 'Mobile App UI', <ProjectProgress value={40} accent="orange" />, <StatusBadge value="Revisi" />, 'Pak Dimas', '22 Mei 2024'],
    ['3', 'Dewi Puspita', 'User Flow & Wireframe', <ProjectProgress value={90} />, <StatusBadge value="Proses" />, 'Bu Rina', '20 Mei 2024'],
    ['4', 'Eko Prasetyo', 'Dashboard Admin', <ProjectProgress value={100} accent="green" />, <StatusBadge value="Selesai" />, 'Pak Dimas', '18 Mei 2024'],
  ];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Laporan Project Siswa"
        action={<PrimaryButton icon={Plus}>Tambah Project</PrimaryButton>}
      >
        <div className="mb-5 flex flex-wrap gap-3">
          <SelectBox>Kelas: UI/UX Design</SelectBox>
          <SelectBox>Status: Semua Status</SelectBox>
        </div>
        <DataTable columns={['No', 'Siswa', 'Project', 'Progress', 'Status', 'Mentor', 'Deadline']} rows={rows} />
      </SectionCard>
      <SectionCard title="Detail Project">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr_1.1fr]">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">AW</div>
            <div>
              <p className="text-lg font-bold text-slate-950">Andi Wijaya</p>
              <p className="mt-1 text-sm text-slate-500">UI/UX Design</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500">Project</p>
            <p className="mt-1 font-semibold text-slate-950">Redesign Landing Page</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-semibold text-blue-700">75%</span>
              <StatusBadge value="Proses" />
            </div>
            <div className="mt-3"><ProgressBar value={75} /></div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">Mentor Notes</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Desain sudah bagus, perbaiki pada bagian kontras warna tombol CTA.</p>
            <p className="mt-4 font-semibold text-slate-950">Next Target</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Finalisasi halaman beranda & integrasi aset.</p>
            <p className="mt-4 text-sm text-slate-500">Deadline: <span className="font-semibold text-slate-900">25 Mei 2024</span></p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function ProjectProgress({ value, accent = 'blue' }) {
  return (
    <div className="flex min-w-[150px] items-center gap-3">
      <span className="w-9 text-sm font-semibold text-slate-700">{value}%</span>
      <ProgressBar value={value} accent={accent} />
    </div>
  );
}

function StudentProfilePage({ activeTab, setActiveTab }) {
  const tabs = ['Ringkasan', 'Kehadiran', 'SPP', 'Project', 'Informasi'];
  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">AW</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Andi Wijaya</h2>
              <p className="mt-1 text-sm font-medium text-slate-600">Web Development - Pagi</p>
              <p className="mt-1 text-sm text-slate-500">Bergabung sejak 10 Jan 2024</p>
            </div>
          </div>
          <PrimaryButton icon={MessageCircle} color="green">Kirim Pesan</PrimaryButton>
        </div>
      </SectionCard>
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard title="Kehadiran" value="78%" subtext="(35 / 45 pertemuan)" icon={CalendarCheck} accent="blue" />
        <StatCard title="SPP Mei 2024" value="Belum Lunas" subtext="Rp 1.000.000" icon={Wallet} accent="red" />
        <StatCard title="Project Aktif" value="75%" subtext="Redesign Landing Page" icon={FolderKanban} accent="purple" />
      </div>
      <SectionCard>
        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{tab}</button>
          ))}
        </div>
        {activeTab === 'Ringkasan' ? <ProfileSummary /> : <PlaceholderInner title={`${activeTab} siswa`} />}
      </SectionCard>
    </div>
  );
}

function ProfileSummary() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-950">Ringkasan Kehadiran</h3>
        <p className="mt-1 text-sm text-slate-500">7 Hari Terakhir</p>
        <div className="mt-5 flex h-28 items-end gap-3">
          {[52, 68, 80, 62, 78, 66, 74].map((value, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-lg bg-blue-500" style={{ height: `${value}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-950">Riwayat SPP Terakhir</h3>
        <div className="mt-4 space-y-3">
          {[
            ['Mei 2024', 'Belum Lunas'],
            ['Apr 2024', 'Lunas'],
            ['Mar 2024', 'Lunas'],
          ].map(([month, status]) => (
            <div key={month} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">{month}</span>
              <StatusBadge value={status} />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-950">Project Terbaru</h3>
        <p className="mt-4 font-semibold text-slate-800">Redesign Landing Page</p>
        <p className="mt-2 text-sm text-blue-700">75%</p>
        <div className="mt-3"><ProgressBar value={75} /></div>
        <p className="mt-4 text-sm text-slate-500">Deadline: <span className="font-semibold text-slate-900">25 Mei 2024</span></p>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <SectionCard title={title}>
      <PlaceholderInner title="Dalam pengembangan" />
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.slice(0, 6).map((name, index) => (
          <div key={name} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {name.split(' ').map((part) => part[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{name}</p>
                <p className="text-sm text-slate-500">{['Web Development - Pagi', 'UI/UX Design', 'Digital Marketing'][index % 3]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function PlaceholderInner({ title }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
        Modul ini sudah mendapat tempat di navigasi dan siap dikembangkan mengikuti schema Cloudflare D1 pada PRD.
      </p>
    </div>
  );
}

export default App;
