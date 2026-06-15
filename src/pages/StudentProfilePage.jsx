import { useState } from 'react';
import { CalendarCheck, FolderKanban, MessageCircle, Wallet } from 'lucide-react';
import { PlaceholderInner, PrimaryButton, ProgressBar, SectionCard, StatCard, StatusBadge } from '../components/ui';

export function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState('Ringkasan');
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
