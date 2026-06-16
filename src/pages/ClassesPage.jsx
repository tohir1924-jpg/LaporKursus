import { useState, useEffect } from 'react';
import { Plus, X, BookOpen, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '../hooks/useApi';
import { api } from '../lib/apiClient';
import { DataTable, PrimaryButton, SectionCard, StatusBadge } from '../components/ui';

export function ClassesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [programId, setProgramId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [dayName, setDayName] = useState('Senin & Rabu');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');

  // 1. Fetch lookup data
  const { data: programs } = useQuery('/programs');
  const { data: teachers } = useQuery('/users?role=teacher');

  // Set lookup defaults
  useEffect(() => {
    if (programs && programs.length > 0 && !programId) {
      setProgramId(programs[0].id);
    }
  }, [programs]);

  useEffect(() => {
    if (teachers && teachers.length > 0 && !teacherId) {
      setTeacherId(teachers[0].id);
    }
  }, [teachers]);

  // 2. Fetch classes
  const { data: classes, loading: loadingClasses, refetch: refetchClasses } = useQuery('/classes?status=active');

  // 3. Mutation to create class
  const createMutation = useMutation((payload) => api.post('/classes', payload));

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutate({
        name,
        program_id: programId,
        teacher_id: teacherId || null,
        day_name: dayName,
        start_time: startTime,
        end_time: endTime
      });
      setShowAddModal(false);
      refetchClasses();
      setName('');
    } catch (err) {
      alert(err.message || 'Gagal membuat kelas baru');
    }
  };

  const tableRows = classes 
    ? classes.map((c, i) => [
        i + 1,
        c.name,
        c.program_name || '-',
        c.teacher_name || 'Belum ditunjuk',
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Calendar size={14} className="text-slate-400" />
          <span>{c.day_name || '-'}</span>
        </div>,
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Clock size={14} className="text-slate-400" />
          <span>{c.start_time} - {c.end_time} WIB</span>
        </div>,
        <StatusBadge value={c.status === 'active' ? 'Aktif' : 'Nonaktif'} />
      ])
    : [];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Daftar Kelas Kursus"
        action={<PrimaryButton onClick={() => setShowAddModal(true)} icon={Plus}>Tambah Kelas</PrimaryButton>}
      >
        {loadingClasses ? (
          <div className="py-12 text-center text-slate-500">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
            <span>Memuat data kelas...</span>
          </div>
        ) : tableRows.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <span>Belum ada data kelas terdaftar.</span>
          </div>
        ) : (
          <DataTable columns={['No', 'Nama Kelas', 'Program Kursus', 'Pengajar', 'Hari', 'Jam Kursus', 'Status']} rows={tableRows} />
        )}
      </SectionCard>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Tambah Kelas Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Kelas</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Coding Kids A, Web Dev Malam"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Program Kursus</label>
                <select
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  required
                >
                  {programs && programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pengajar (Mentor)</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                >
                  {teachers && teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hari Kursus</label>
                <input
                  type="text"
                  value={dayName}
                  onChange={(e) => setDayName(e.target.value)}
                  placeholder="Contoh: Senin & Rabu, Sabtu"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Jam Mulai</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Jam Selesai</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.loading}
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  {createMutation.loading ? 'Menyimpan...' : 'Simpan Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
