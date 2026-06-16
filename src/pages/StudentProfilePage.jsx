import { useState, useEffect } from 'react';
import { CalendarCheck, FolderKanban, MessageCircle, Wallet, User, Mail, Phone, Calendar, BookOpen, Clock, FileText } from 'lucide-react';
import { useQuery } from '../hooks/useApi';
import { PlaceholderInner, PrimaryButton, ProgressBar, SectionCard, StatCard, StatusBadge } from '../components/ui';

export function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState('Ringkasan');
  const tabs = ['Ringkasan', 'Kehadiran', 'SPP', 'Project', 'Informasi'];

  // Parse student_id from query params, fallback to std_001 (Andi Wijaya in seeds)
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('student_id') || 'std_001';

  // 1. Fetch student master detail
  const { data: student, loading: loadingStudent } = useQuery(`/students/${studentId}`);

  // 2. Fetch student statistics/lists
  const { data: attendance } = useQuery(`/attendance?student_id=${studentId}`);
  const { data: fees } = useQuery(`/fees?student_id=${studentId}`);
  const { data: projects } = useQuery(`/projects?student_id=${studentId}`);

  // 3. Compute stats
  const totalMeetings = attendance ? attendance.length : 0;
  const presentMeetings = attendance 
    ? attendance.filter(a => a.status === 'H' || a.status === 'T').length 
    : 0;
  const attendanceRate = totalMeetings > 0 ? Math.round((presentMeetings / totalMeetings) * 100) : 0;

  // Unpaid fee calculation
  const unpaidFee = fees 
    ? fees.find(f => f.status === 'unpaid' || f.status === 'partial') 
    : null;
  const unpaidFeeText = unpaidFee 
    ? `Belum Lunas (${unpaidFee.month}/${unpaidFee.year})` 
    : 'Lunas Semua';
  const unpaidFeeAmount = unpaidFee 
    ? `Rp ${(unpaidFee.amount - (unpaidFee.total_paid || 0)).toLocaleString('id-ID')}` 
    : 'Rp 0';

  // Project progress calculation
  const activeProject = projects && projects.length > 0 ? projects[0] : null;
  const projectProgress = activeProject ? activeProject.progress : 0;

  if (loadingStudent) {
    return (
      <div className="py-12 text-center text-slate-500">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
        <span>Memuat data profil siswa...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
        <span>Siswa tidak ditemukan. Hubungkan database atau gunakan student_id yang valid.</span>
      </div>
    );
  }

  // Handle direct WA message trigger
  const handleSendMessage = () => {
    const phone = student.guardian_phone || student.phone;
    if (phone) {
      const cleaned = phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
      window.open(`https://wa.me/${cleaned}`, '_blank');
    } else {
      alert('Tidak ada nomor kontak WhatsApp untuk siswa ini.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-2xl font-bold text-white shadow-md">
              {student.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">{student.name}</h2>
              <p className="mt-1 text-sm font-semibold text-blue-700">{student.class_name || 'Tanpa Kelas'}</p>
              <p className="mt-1 text-xs text-slate-500">Program: {student.program_name || '-'}</p>
            </div>
          </div>
          <PrimaryButton onClick={handleSendMessage} icon={MessageCircle} color="green">Kirim Pesan</PrimaryButton>
        </div>
      </SectionCard>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard title="Rasio Kehadiran" value={`${attendanceRate}%`} subtext={`(${presentMeetings} / ${totalMeetings} pertemuan)`} icon={CalendarCheck} accent="blue" />
        <StatCard title="Status Tagihan SPP" value={unpaidFeeText} subtext={unpaidFeeAmount} icon={Wallet} accent={unpaidFee ? 'red' : 'green'} />
        <StatCard title="Progress Project" value={`${projectProgress}%`} subtext={activeProject ? activeProject.title : 'Belum ada project'} icon={FolderKanban} accent="purple" />
      </div>

      {/* Tabs Section */}
      <SectionCard>
        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Ringkasan' && <ProfileSummary attendance={attendance} fees={fees} project={activeProject} />}
        {activeTab === 'Kehadiran' && <ProfileAttendance attendance={attendance} />}
        {activeTab === 'SPP' && <ProfileSPP fees={fees} />}
        {activeTab === 'Project' && <ProfileProjects projects={projects} />}
        {activeTab === 'Informasi' && <ProfileInfo student={student} />}
      </SectionCard>
    </div>
  );
}

// 1. Ringkasan Tab Component
function ProfileSummary({ attendance, fees, project }) {
  const last7Days = attendance ? attendance.slice(0, 7) : [];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="font-bold text-slate-950 text-sm">Riwayat Hadir Terakhir</h3>
        <p className="mt-0.5 text-xs text-slate-500">Maksimal 7 pertemuan terakhir</p>
        <div className="mt-5 flex h-28 items-end gap-3.5">
          {last7Days.map((att, index) => {
            const h = att.status === 'H' ? 'h-full bg-green-500' : att.status === 'T' ? 'h-5/6 bg-orange-500' : att.status === 'I' ? 'h-1/2 bg-blue-500' : 'h-1/6 bg-red-500';
            return (
              <div key={index} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                <div className={`w-full rounded-t-md transition-all ${h}`} title={`${att.attendance_date}: ${att.status}`} />
                <span className="text-[10px] font-bold text-slate-400">{att.status}</span>
              </div>
            );
          })}
          {last7Days.length === 0 && (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
              Belum ada riwayat
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="font-bold text-slate-950 text-sm">Tagihan Bulanan Terakhir</h3>
        <div className="mt-4 space-y-3">
          {fees && fees.slice(0, 3).map((fee) => {
            const statusText = fee.status === 'paid' ? 'Lunas' : fee.status === 'partial' ? 'Sebagian' : 'Belum Lunas';
            return (
              <div key={fee.id} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">{fee.month}/{fee.year}</span>
                <StatusBadge value={statusText} />
              </div>
            );
          })}
          {(!fees || fees.length === 0) && (
            <p className="text-xs text-slate-400 py-2">Belum ada tagihan SPP.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="font-bold text-slate-950 text-sm">Project Terbaru</h3>
        {project ? (
          <div className="mt-4 space-y-3">
            <p className="font-bold text-slate-800 text-sm leading-tight">{project.title}</p>
            <p className="text-xs text-blue-700 font-bold">{project.progress}% Selesai</p>
            <ProgressBar value={project.progress} />
            <p className="text-xs text-slate-400">Target selesai: <span className="font-semibold text-slate-800">{project.target_date || '-'}</span></p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4">Belum ada project aktif.</p>
        )}
      </div>
    </div>
  );
}

// 2. Kehadiran Tab Component
function ProfileAttendance({ attendance }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 font-semibold">Tanggal Pertemuan</th>
            <th className="px-6 py-3 font-semibold">Kelas</th>
            <th className="px-6 py-3 font-semibold">Status</th>
            <th className="px-6 py-3 font-semibold">Keterlambatan</th>
            <th className="px-6 py-3 font-semibold">Catatan Mentor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {attendance && attendance.map((att) => {
            const statusText = att.status === 'H' ? 'Hadir' : att.status === 'A' ? 'Alpa' : att.status === 'I' ? 'Izin' : 'Telat';
            return (
              <tr key={att.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-semibold text-slate-900">{att.attendance_date}</td>
                <td className="px-6 py-4 text-slate-600">{att.class_name || '-'}</td>
                <td className="px-6 py-4"><StatusBadge value={att.status} /> <span className="ml-1.5 text-xs text-slate-500">({statusText})</span></td>
                <td className="px-6 py-4 text-slate-600">{att.late_minutes ? `${att.late_minutes} menit` : '-'}</td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{att.note || '-'}</td>
              </tr>
            );
          })}
          {(!attendance || attendance.length === 0) && (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-slate-400">Belum ada data absensi untuk siswa ini.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// 3. SPP Tab Component
function ProfileSPP({ fees }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 font-semibold">Bulan/Tahun</th>
            <th className="px-6 py-3 font-semibold">Jatuh Tempo</th>
            <th className="px-6 py-3 font-semibold">Nominal SPP</th>
            <th className="px-6 py-3 font-semibold">Sudah Dibayar</th>
            <th className="px-6 py-3 font-semibold">Status</th>
            <th className="px-6 py-3 font-semibold">Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {fees && fees.map((fee) => {
            const statusText = fee.status === 'paid' ? 'Lunas' : fee.status === 'partial' ? 'Sebagian' : 'Belum Lunas';
            return (
              <tr key={fee.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-semibold text-slate-900">{fee.month}/{fee.year}</td>
                <td className="px-6 py-4 text-slate-600">{fee.due_date || '-'}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">Rp {fee.amount.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-green-700 font-semibold">Rp {(fee.total_paid || 0).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4"><StatusBadge value={statusText} /></td>
                <td className="px-6 py-4 text-slate-500">{fee.note || '-'}</td>
              </tr>
            );
          })}
          {(!fees || fees.length === 0) && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-slate-400">Belum ada tagihan SPP untuk siswa ini.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// 4. Project Tab Component
function ProfileProjects({ projects }) {
  return (
    <div className="space-y-6">
      {projects && projects.map((prj) => {
        const statusText = prj.status === 'not_started' ? 'Belum Mulai' : prj.status === 'in_progress' ? 'Proses' : prj.status === 'revision' ? 'Revisi' : 'Selesai';
        return (
          <div key={prj.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FolderKanban size={18} className="text-blue-600" />
                  {prj.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500">Kelas: <span className="font-semibold text-slate-800">{prj.class_name || '-'}</span></p>
              </div>
              <StatusBadge value={statusText} />
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {prj.description || 'Tidak ada deskripsi project.'}
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Kemajuan Project</span>
                <span className="text-blue-700">{prj.progress}%</span>
              </div>
              <ProgressBar value={prj.progress} />
            </div>

            <div className="flex flex-wrap gap-5 text-xs text-slate-500 border-t border-slate-100 pt-3">
              <span>Tanggal Mulai: <span className="font-bold text-slate-700">{prj.start_date || '-'}</span></span>
              <span>Deadline: <span className="font-bold text-slate-700">{prj.target_date || '-'}</span></span>
              {prj.project_link && (
                <a href={prj.project_link} target="_blank" rel="noreferrer" className="text-teal-600 font-bold underline flex items-center gap-1">
                  Buka Link Hasil
                </a>
              )}
            </div>
          </div>
        );
      })}

      {(!projects || projects.length === 0) && (
        <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
          Belum ada data project terdaftar.
        </div>
      )}
    </div>
  );
}

// 5. Informasi Kontak Tab Component
function ProfileInfo({ student }) {
  const details = [
    { label: 'Nama Lengkap', value: student.name, icon: User },
    { label: 'Nomor WhatsApp Siswa', value: student.phone || 'Tidak tersedia', icon: Phone },
    { label: 'Nama Orang Tua / Wali', value: student.guardian_name || 'Tidak tersedia', icon: User },
    { label: 'WhatsApp Orang Tua / Wali', value: student.guardian_phone || 'Tidak tersedia', icon: Phone },
    { label: 'Program Kursus', value: student.program_name || 'Tidak ditentukan', icon: BookOpen },
    { label: 'Kelas Aktif', value: student.class_name || 'Tidak terikat kelas', icon: Clock },
    { label: 'Tanggal Bergabung', value: student.join_date || '-', icon: Calendar },
    { label: 'Catatan Khusus', value: student.note || 'Tidak ada catatan tambahan', icon: FileText },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {details.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:border-slate-200 transition">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <Icon size={18} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-900 leading-tight">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
