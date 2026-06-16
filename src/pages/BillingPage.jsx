import { useState, useEffect } from 'react';
import { CheckCircle2, CreditCard, FileBarChart, Search, Wallet, Plus, X, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '../hooks/useApi';
import { api } from '../lib/apiClient';
import { DataTable, PrimaryButton, SectionCard, StatCard, StatusBadge } from '../components/ui';

export function BillingPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditFeeModal, setShowEditFeeModal] = useState(false);
  const [activeFee, setActiveFee] = useState(null);
  
  // Payment form states
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNote, setPaymentNote] = useState('');

  // Fee Edit form states
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');

  // Class state for generation
  const [genClassId, setGenClassId] = useState('');

  // 1. Fetch Classes for filter and generator
  const { data: classes } = useQuery('/classes');

  useEffect(() => {
    if (classes && classes.length > 0) {
      if (!selectedClass) setSelectedClass('all');
      if (!genClassId) setGenClassId(classes[0].id);
    }
  }, [classes]);

  // 2. Fetch Tuition Summary Statistics
  const { data: summary, refetch: refetchSummary } = useQuery(
    `/fees/summary?month=${selectedMonth}&year=${selectedYear}`
  );

  // 3. Fetch Tuition Fees List
  const { data: fees, loading: loadingFees, refetch: refetchFees } = useQuery(
    `/fees?month=${selectedMonth}&year=${selectedYear}${selectedClass && selectedClass !== 'all' ? `&class_id=${selectedClass}` : ''}`
  );

  // 4. Mutation for generating bills
  const generateMutation = useMutation((payload) => api.post('/fees/generate', payload));

  // 5. Mutation for payment
  const paymentMutation = useMutation(({ feeId, payload }) => api.post(`/fees/${feeId}/payments`, payload));

  // 5.1. Mutation for editing billing
  const editFeeMutation = useMutation(({ feeId, payload }) => api.put(`/fees/${feeId}`, payload));

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await generateMutation.mutate({
        month: Number(selectedMonth),
        year: Number(selectedYear),
        class_id: genClassId
      });
      setShowGenerateModal(false);
      refetchFees();
      refetchSummary();
      alert('Tagihan SPP berhasil digenerate!');
    } catch (err) {
      alert(err.message || 'Gagal membuat tagihan SPP');
    }
  };

  const handleOpenPayment = (fee) => {
    setActiveFee(fee);
    const outstanding = fee.amount - (fee.total_paid || 0);
    setPaymentAmount(outstanding);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('cash');
    setPaymentNote('');
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await paymentMutation.mutate({
        feeId: activeFee.id,
        payload: {
          payment_date: paymentDate,
          amount: Number(paymentAmount),
          method: paymentMethod,
          note: paymentNote
        }
      });
      setShowPaymentModal(false);
      refetchFees();
      refetchSummary();
    } catch (err) {
      alert(err.message || 'Gagal memproses pembayaran');
    }
  };

  const handleOpenEditFee = (fee) => {
    setActiveFee(fee);
    setEditAmount(fee.amount);
    setEditNote(fee.note || '');
    setShowEditFeeModal(true);
  };

  const handleEditFeeSubmit = async (e) => {
    e.preventDefault();
    try {
      await editFeeMutation.mutate({
        feeId: activeFee.id,
        payload: {
          amount: Number(editAmount),
          note: editNote
        }
      });
      setShowEditFeeModal(false);
      refetchFees();
      refetchSummary();
    } catch (err) {
      alert(err.message || 'Gagal mengubah nominal tagihan');
    }
  };

  // 6. CSV Exporter
  const handleExport = () => {
    if (!fees || fees.length === 0) return;
    
    const headers = ['No', 'Nama Siswa', 'Kelas', 'Bulan/Tahun', 'Tagihan', 'Sudah Dibayar', 'Status'];
    const rows = fees.map((f, i) => [
      i + 1,
      f.student_name,
      f.class_name || '-',
      `${f.month}/${f.year}`,
      f.amount,
      f.total_paid || 0,
      f.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_SPP_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter list by search query
  const filteredFees = fees 
    ? fees.filter(f => f.student_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const tableRows = filteredFees.map((f, i) => {
    const totalPaid = f.total_paid || 0;
    const remaining = f.amount - totalPaid;
    const statusText = f.status === 'paid' ? 'Lunas' : f.status === 'partial' ? 'Sebagian' : 'Belum Lunas';

    return [
      i + 1,
      f.student_name,
      f.class_name || '-',
      `${f.month}/${f.year}`,
      `Rp ${f.amount.toLocaleString('id-ID')}`,
      `Rp ${totalPaid.toLocaleString('id-ID')}`,
      <StatusBadge value={statusText} />,
      <div className="flex gap-2">
        <button 
          onClick={() => handleOpenEditFee(f)}
          className="font-bold text-slate-500 hover:text-slate-800 transition"
          title="Ubah Nominal Tagihan"
        >
          Ubah
        </button>
        {f.status !== 'paid' ? (
          <button 
            onClick={() => handleOpenPayment(f)}
            className="font-bold text-red-600 hover:text-red-700 transition"
          >
            Bayar
          </button>
        ) : (
          <span className="font-semibold text-slate-400">Lunas</span>
        )}
      </div>
    ];
  });

  const months = [
    { v: 1, label: 'Januari' }, { v: 2, label: 'Februari' }, { v: 3, label: 'Maret' },
    { v: 4, label: 'April' }, { v: 5, label: 'Mei' }, { v: 6, label: 'Juni' },
    { v: 7, label: 'Juli' }, { v: 8, label: 'Agustus' }, { v: 9, label: 'September' },
    { v: 10, label: 'Okt' }, { v: 11, label: 'Nov' }, { v: 12, label: 'Des' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid flex-1 gap-5 md:grid-cols-3">
          <StatCard 
            title="Total Pemasukan" 
            value={summary ? `Rp ${summary.revenue.toLocaleString('id-ID')}` : 'Rp 0'} 
            subtext="Kas terkumpul bulan ini" 
            icon={Wallet} 
            accent="green" 
          />
          <StatCard 
            title="Total Tunggakan" 
            value={summary ? `Rp ${summary.tunggakan.toLocaleString('id-ID')}` : 'Rp 0'} 
            subtext={`${summary ? summary.tunggakan_students : 0} siswa belum lunas`} 
            icon={CreditCard} 
            accent="orange" 
          />
          <StatCard 
            title="Persentase Lunas" 
            value={summary ? `${summary.month_stats.lunas_percentage}%` : '0%'} 
            subtext={`${summary ? summary.month_stats.paid_bills : 0} dari ${summary ? summary.month_stats.total_bills : 0} tagihan`} 
            icon={CheckCircle2} 
            accent="blue" 
          />
        </div>
      </div>

      <SectionCard
        title="Daftar SPP Bulanan"
        action={
          <div className="flex gap-2">
            <PrimaryButton onClick={() => setShowGenerateModal(true)} icon={Plus}>Buat Tagihan</PrimaryButton>
            <button 
              onClick={handleExport}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none"
            >
              <FileBarChart size={17} />
              Export CSV
            </button>
          </div>
        }
      >
        <div className="mb-5 flex flex-wrap gap-3">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            {months.map(m => <option key={m.v} value={m.v}>{m.label}</option>)}
          </select>

          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">Semua Kelas</option>
            {classes && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" 
              placeholder="Cari nama siswa..." 
            />
          </label>
        </div>

        {loadingFees ? (
          <div className="py-12 text-center text-slate-500">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
            <span>Memuat data tagihan...</span>
          </div>
        ) : filteredFees.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <span>Tidak ada data tagihan ditemukan. Silakan klik "Buat Tagihan" untuk membuat tagihan baru.</span>
          </div>
        ) : (
          <DataTable columns={['No', 'Nama Siswa', 'Kelas', 'Bulan', 'Nominal', 'Dibayar', 'Status', 'Aksi']} rows={tableRows} />
        )}
      </SectionCard>

      {/* Generate Billing Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Buat Tagihan SPP Bulanan</h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleGenerate} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bulan / Tahun</label>
                <div className="mt-1.5 grid grid-cols-2 gap-3">
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    {months.map(m => <option key={m.v} value={m.v}>{m.label}</option>)}
                  </select>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Kelas</label>
                <select
                  value={genClassId}
                  onChange={(e) => setGenClassId(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  required
                >
                  {classes && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700 leading-5">
                <p className="font-semibold">Aturan Idempotensi:</p>
                <p>Sistem tidak akan menduplikasi tagihan. Siswa yang sudah memiliki tagihan di bulan/tahun yang sama akan dilewati secara otomatis.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowGenerateModal(false)}
                  className="h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={generateMutation.loading}
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  {generateMutation.loading ? 'Membuat...' : 'Generate Tagihan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Input Payment Modal */}
      {showPaymentModal && activeFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Catat Pembayaran SPP</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-500">Nama Siswa</p>
              <p className="text-base font-bold text-slate-900">{activeFee.student_name}</p>
            </div>
            <form onSubmit={handlePaymentSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nominal Pembayaran (Rp)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  required
                  max={activeFee.amount - (activeFee.total_paid || 0)}
                  min="1"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Total tagihan: Rp {activeFee.amount.toLocaleString('id-ID')} | Sisa tagihan: Rp {(activeFee.amount - (activeFee.total_paid || 0)).toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal Bayar</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Metode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                >
                  <option value="cash">Cash (Tunai)</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="qris">QRIS / E-Wallet</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Catatan</label>
                <input
                  type="text"
                  placeholder="Keterangan (misal: Transfer Bank Mandiri)"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowPaymentModal(false)}
                  className="h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={paymentMutation.loading}
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  {paymentMutation.loading ? 'Menyimpan...' : 'Simpan Pembayaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fee Nominal Modal */}
      {showEditFeeModal && activeFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Ubah Nominal Tagihan SPP</h3>
              <button onClick={() => setShowEditFeeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-500">Nama Siswa</p>
              <p className="text-base font-bold text-slate-900">{activeFee.student_name}</p>
              <p className="mt-0.5 text-xs text-slate-500">Bulan Tagihan: {activeFee.month}/{activeFee.year}</p>
            </div>
            <form onSubmit={handleEditFeeSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nominal Baru (Rp)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  required
                  min={activeFee.total_paid || 0}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Sudah dibayarkan oleh siswa: Rp {(activeFee.total_paid || 0).toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Catatan Perubahan</label>
                <input
                  type="text"
                  placeholder="Alasan perubahan (misal: Diskon khusus, Beasiswa)"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditFeeModal(false)}
                  className="h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={editFeeMutation.loading}
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  {editFeeMutation.loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
