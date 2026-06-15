import { CheckCircle2, CreditCard, FileBarChart, Search, Wallet } from 'lucide-react';
import { billingItems } from '../data/mockData';
import { DataTable, PrimaryButton, SectionCard, SelectBox, StatCard, StatusBadge } from '../components/ui';

export function BillingPage() {
  const rows = billingItems.map(([no, name, klass, month, amount, status, action]) => [
    no,
    name,
    klass,
    month,
    amount,
    <StatusBadge value={status} />,
    <button className={`font-semibold ${action === 'Tagih' ? 'text-red-600' : 'text-blue-700'}`}>{action}</button>,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid flex-1 gap-5 md:grid-cols-3">
          <StatCard title="Total Pemasukan (Mei 2024)" value="Rp 28.750.000" subtext="+12% dari bulan lalu" icon={Wallet} accent="green" />
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
