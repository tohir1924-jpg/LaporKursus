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
  const { data: attendanceHistory } = useQuery('/attendance');

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
        <AttendanceChart attendanceHistory={attendanceHistory} />
        <ReminderList />
      </div>
      <SectionCard title="Aktivitas Hari Ini">
        <DataTable columns={['Waktu', 'Aktivitas', 'Detail', 'Oleh']} rows={formattedActivityRows} />
      </SectionCard>
    </div>
  );
}

function AttendanceChart({ attendanceHistory }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 1. Group records by date and compute rates
  let parsedData = [];
  if (attendanceHistory && attendanceHistory.length > 0) {
    const grouped = {};
    attendanceHistory.forEach((record) => {
      const dateStr = record.attendance_date;
      if (!grouped[dateStr]) {
        grouped[dateStr] = { present: 0, total: 0 };
      }
      grouped[dateStr].total += 1;
      // 'H' (Hadir) and 'T' (Terlambat) count as present
      if (record.status === 'H' || record.status === 'T') {
        grouped[dateStr].present += 1;
      }
    });

    const sortedDates = Object.keys(grouped).sort();
    parsedData = sortedDates.map((dateStr) => {
      const { present, total } = grouped[dateStr];
      const rate = total > 0 ? Math.round((present / total) * 100) : 0;
      
      const dateObj = new Date(dateStr);
      const label = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return {
        label,
        rate,
        present,
        total,
        rawDate: dateStr,
      };
    });
  }

  // 2. Fallback mock data if there are insufficient records
  const fallbackData = [
    { label: '10 Jun', rate: 70, present: 7, total: 10 },
    { label: '11 Jun', rate: 78, present: 78, total: 100 },
    { label: '12 Jun', rate: 82, present: 82, total: 100 },
    { label: '13 Jun', rate: 96, present: 96, total: 100 },
    { label: '14 Jun', rate: 80, present: 8, total: 10 },
    { label: '15 Jun', rate: 88, present: 88, total: 100 },
    { label: '16 Jun', rate: 85, present: 85, total: 100 },
  ];

  const data = parsedData.length >= 2 ? parsedData.slice(-7) : fallbackData;

  // 3. Define Chart Layout metrics
  const paddingLeft = 44;
  const paddingRight = 570;
  const graphWidth = paddingRight - paddingLeft;
  const numPoints = data.length;

  // Map to points
  const points = data.map((item, index) => {
    const x = paddingLeft + (index * (graphWidth / (numPoints - 1)));
    const y = 208 - (item.rate / 100) * 188; // Range from y=20 (100%) to y=208 (0%)
    return { x, y, ...item };
  });

  // SVG Paths
  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} 208 L ${points[0].x} 208 Z` 
    : '';

  return (
    <SectionCard title="Ringkasan Kehadiran (7 Hari Terakhir)">
      <div className="relative overflow-hidden rounded-2xl bg-slate-50 px-2 py-4">
        <svg viewBox="0 0 600 230" className="h-[260px] w-full overflow-visible">
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {[20, 67, 114, 161, 208].map((y, index) => (
            <g key={y}>
              <line x1="44" x2="570" y1={y} y2={y} stroke="#E2E8F0" strokeWidth="1" />
              <text x="4" y={y + 4} fontSize="11" fill="#64748B" className="font-semibold select-none">
                {[100, 75, 50, 25, 0][index]}%
              </text>
            </g>
          ))}

          {/* Area under curve */}
          {areaPath && (
            <path d={areaPath} fill="url(#chartAreaGradient)" />
          )}

          {/* Trend Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#2563EB"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Hover indicator vertical line */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <line
              x1={points[hoveredIndex].x}
              x2={points[hoveredIndex].x}
              y1={20}
              y2={208}
              stroke="#93C5FD"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Data Points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx}>
                {/* Outer halo on hover */}
                {isHovered && (
                  <circle cx={p.x} cy={p.y} r="10" fill="#DBEAFE" />
                )}
                {/* Core dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "5.5" : "4.5"}
                  fill="#2563EB"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y="224"
              fontSize="11"
              fill={hoveredIndex === idx ? "#1E3A8A" : "#64748B"}
              className="font-semibold text-center select-none"
              textAnchor="middle"
            >
              {p.label}
            </text>
          ))}

          {/* Interactive vertical hover trigger regions */}
          {points.map((p, idx) => (
            <rect
              key={idx}
              x={p.x - 25}
              y={10}
              width={50}
              height={205}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Dynamic Interactive HTML Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg text-xs pointer-events-none transition-all duration-75 select-none"
            style={{
              left: `${points[hoveredIndex].x}px`,
              top: `${points[hoveredIndex].y - 12}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-bold text-slate-900">{points[hoveredIndex].rawDate ? new Date(points[hoveredIndex].rawDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : points[hoveredIndex].label}</p>
            <p className="mt-1 text-slate-600 font-semibold flex items-center justify-between gap-4">
              <span>Kehadiran:</span>
              <span className="text-blue-600 text-sm">{points[hoveredIndex].rate}%</span>
            </p>
            <p className="mt-0.5 text-slate-500 flex items-center justify-between gap-4">
              <span>Rasio data:</span>
              <span>{points[hoveredIndex].present} / {points[hoveredIndex].total} murid</span>
            </p>
          </div>
        )}
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

