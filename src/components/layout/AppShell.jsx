import {
  Bell,
  BookOpen,
  CalendarCheck,
  FileBarChart,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Search,
  Settings,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, match: ['/', '/dashboard'] },
  { to: '/students', label: 'Siswa', icon: Users },
  { to: '/classes', label: 'Kelas', icon: BookOpen },
  { to: '/attendance', label: 'Absensi', icon: CalendarCheck },
  { to: '/billing', label: 'SPP Bulanan', icon: Wallet },
  { to: '/reminders', label: 'Pesan Pengingat', icon: MessageCircle },
  { to: '/projects', label: 'Project Siswa', icon: FolderKanban },
  { to: '/reports', label: 'Laporan', icon: FileBarChart },
  { to: '/settings', label: 'Pengaturan', icon: Settings },
];

const pageTitles = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/students': 'Siswa',
  '/classes': 'Kelas',
  '/attendance': 'Absensi',
  '/billing': 'SPP Bulanan',
  '/reminders': 'Pesan Pengingat',
  '/projects': 'Project Siswa',
  '/profile': 'Profil Siswa',
  '/reports': 'Laporan',
  '/settings': 'Pengaturan',
};

export function AppShell({ children }) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Sidebar />
      <div className="min-h-screen lg:pl-[260px]">
        <Topbar pageTitle={pageTitle} />
        <main className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <button
        type="button"
        onClick={() => navigate('/')}
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
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => {
                const active = isActive || item.match?.includes(location.pathname);
                return `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`;
              }}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
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
