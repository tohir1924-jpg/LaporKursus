import { useEffect, useState } from 'react';
import {
  BookOpen,
  CalendarCheck,
  CreditCard,
  FileCheck2,
  FolderKanban,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { activityRows as mockActivityRows } from '../data/mockData';
import { accentMap, DataTable, SectionCard, StatCard } from '../components/ui';
import { useQuery } from '../hooks/useApi';

export function DashboardPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Fetch API data
  const { data: studentsData, loading: loadingStudents } = useQuery('/students');
  const { data: feesSummary, loading: loadingFees } = useQuery(`/fees/summary?month=${currentMonth}&year=${currentYear}`);
  const { data: projectsData, loading: loadingProjects } = useQuery('/projects');
  const { data: logsData, loading: loadingLogs } = useQuery('/messages/logs');
  const { data: attendanceToday } = useQuery(`/attendance?date=${new Date().toISOString().split('T')[0]}`);

  // 1. Calculate Active Students
  const activeStudentsCount = studentsData 
    ? studentsData.filter(s => s.status === 'active').length 
    : 128;
  const activeStudentsSubtext = studentsData 
    ? `Total data: ${studentsData.length} siswa` 
    : "+8 dari bulan lalu";

  // 2. Calculate Attendance Today
  const attendanceTodayCount = attendanceToday && attendanceToday.length > 0
    ? attendanceToday.filter(a => a.status === 'H' || a.status === 'T').length
    : 96;
  const attendancePercentage = studentsData && studentsData.length > 0 && attendanceToday
    ? Math.round((attendanceTodayCount / studentsData.filter(s => s.status === 'active').length) * 100)
    : 75;

  // 3. Calculate SPP Belum Lunas
  const unpaidCount = feesSummary ? feesSummary.tunggakan_students : 28;
  const totalTunggakan = feesSummary 
    ? `Rp ${feesSummary.tunggakan.toLocaleString('id-ID')}` 
    : "Rp 14.750.000";

  // 4. Calculate Projects Needing Review
  const pendingProjectsCount = projectsData
    ? projectsData.filter(p => p.status === 'revision' || p.status === 'in_progress').length
    : 17;

  // 5. Activity Log formatting
  const formattedActivityRows = logsData && logsData.length > 0
    ? logsData.slice(0, 5).map(log => {
        const time = new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const text = log.message_type === 'fee' ? 'Kirim tagihan SPP' : 'Kirim log pesan';
        const detail = `${log.student_name || 'Siswa'} - ${log.recipient_phone}`;
        return [time, text, detail, log.sender_name || 'Sistem'];
      })
    : mockActivityRows;

  const isLoading = loadingStudents || loadingFees || loadingProjects || loadingLogs;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-3xl bg-white border border-slate-200" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-28 animate-pulse rounded-2xl bg-white border border-slate-200" />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="h-[320px] animate-pulse rounded-2xl bg-white border border-slate-200" />
          <div className="h-[320px] animate-pulse rounded-2xl bg-white border border-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">Aplikasi Manajemen Kursus & Pelaporan Terpadu</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Kelola data siswa, absensi, pembayaran, project, dan laporan dengan mudah dalam satu platform.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Siswa Aktif" value={String(activeStudentsCount)} subtext={activeStudentsSubtext} icon={Users} accent="blue" />
        <StatCard title="Hadir Hari Ini" value={String(attendanceTodayCount)} subtext={`${attendancePercentage}% dari total siswa`} icon={UserCheck} accent="green" />
        <StatCard title="SPP Belum Lunas" value={String(unpaidCount)} subtext={totalTunggakan} icon={CreditCard} accent="orange" />
        <StatCard title="Project Perlu Review" value={String(pendingProjectsCount)} subtext="Perlu perhatian mentor" icon={FileCheck2} accent="purple" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <AttendanceChart />
        <ReminderList />
      </div>
      <SectionCard title="Aktivitas Hari Ini">
        <DataTable columns={['Waktu', 'Aktivitas', 'Detail', 'Oleh']} rows={formattedActivityRows} />
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
          {points.map(([x, y]) => (
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
    ['SPP Bulan Ini jatuh tempo', 'Beberapa siswa belum membayar', '09:30', Wallet, 'orange'],
    ['Absensi belum diisi', 'Cek kelas hari ini yang belum diisi', '08:45', CalendarCheck, 'blue'],
    ['Project perlu review', 'Beberapa project menunggu review', '08:30', FolderKanban, 'purple'],
    ['Kelas akan dimulai', 'Cek jadwal hari ini', '09:50', BookOpen, 'teal'],
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

