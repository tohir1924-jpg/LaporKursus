import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectItems } from '../data/mockData';
import { DataTable, PrimaryButton, ProgressBar, SectionCard, SelectBox, StatusBadge } from '../components/ui';

export function ProjectsPage() {
  const rows = projectItems.map(([no, student, project, progress, accent, status, mentor, deadline]) => [
    no,
    student === 'Andi Wijaya' ? <Link to="/profile" className="font-semibold text-blue-700">{student}</Link> : student,
    project,
    <ProjectProgress value={progress} accent={accent} />,
    <StatusBadge value={status} />,
    mentor,
    deadline,
  ]);

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
