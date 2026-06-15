import { CheckCircle2 } from 'lucide-react';
import { attendanceStudents } from '../data/mockData';
import { DataTable, PrimaryButton, SectionCard, SelectBox, StatusBadge } from '../components/ui';

export function AttendancePage() {
  const rows = attendanceStudents.map(([no, name, code, status, note]) => [
    no,
    name,
    <StatusBadge value={code} />,
    status,
    note,
  ]);

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
