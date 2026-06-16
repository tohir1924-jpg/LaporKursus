import { useState, useEffect } from 'react';
import { Plus, Search, X, Edit, Trash2, User, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '../hooks/useApi';
import { api } from '../lib/apiClient';
import { DataTable, PrimaryButton, SectionCard, StatusBadge } from '../components/ui';

export function StudentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [classId, setClassId] = useState('');
  const [programId, setProgramId] = useState('');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('active');
  const [note, setNote] = useState('');

  // 1. Fetch lookup data
  const { data: classes } = useQuery('/classes');
  const { data: programs } = useQuery('/programs');

  // Set default lookup selection
  useEffect(() => {
    if (classes && classes.length > 0 && !classId) {
      setClassId(classes[0].id);
    }
  }, [classes]);

  useEffect(() => {
    if (programs && programs.length > 0 && !programId) {
      setProgramId(programs[0].id);
    }
  }, [programs]);

  // 2. Fetch students list
  const { data: students, loading: loadingStudents, refetch: refetchStudents } = useQuery(
    `/students?${selectedClass !== 'all' ? `class_id=${selectedClass}&` : ''}${selectedStatus !== 'all' ? `status=${selectedStatus}&` : ''}${searchQuery ? `search=${searchQuery}` : ''}`
  );

  // 3. Mutations
  const createMutation = useMutation((payload) => api.post('/students', payload));
  const updateMutation = useMutation(({ id, payload }) => api.put(`/students/${id}`, payload));
  const deleteMutation = useMutation((id) => api.delete(`/students/${id}`));

  const handleOpenAdd = () => {
    setName('');
    setPhone('');
    setGuardianName('');
    setGuardianPhone('');
    if (classes && classes.length > 0) setClassId(classes[0].id);
    if (programs && programs.length > 0) setProgramId(programs[0].id);
    setJoinDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (student) => {
    setActiveStudent(student);
    setName(student.name);
    setPhone(student.phone || '');
    setGuardianName(student.guardian_name || '');
    setGuardianPhone(student.guardian_phone || '');
    setClassId(student.class_id || '');
    setProgramId(student.program_id || '');
    setJoinDate(student.join_date || '');
    setStatus(student.status || 'active');
    setNote(student.note || '');
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutate({
        name,
        phone,
        guardian_name: guardianName,
        guardian_phone: guardianPhone,
        class_id: classId || null,
        program_id: programId || null,
        join_date: joinDate,
        note
      });
      setShowAddModal(false);
      refetchStudents();
    } catch (err) {
      alert(err.message || 'Gagal menambahkan siswa');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutate({
        id: activeStudent.id,
        payload: {
          name,
          phone,
          guardian_name: guardianName,
          guardian_phone: guardianPhone,
          class_id: classId || null,
          program_id: programId || null,
          join_date: joinDate,
          status,
          note
        }
      });
      setShowEditModal(false);
      refetchStudents();
    } catch (err) {
      alert(err.message || 'Gagal memperbarui data siswa');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan siswa ini?')) return;
    try {
      await deleteMutation.mutate(id);
      refetchStudents();
    } catch (err) {
      alert(err.message || 'Gagal menonaktifkan siswa');
    }
  };

  const tableRows = students 
    ? students.map((s, i) => {
        const statusText = s.status === 'active' ? 'Aktif' : s.status === 'leave' ? 'Cuti' : 'Nonaktif';
        return [
          i + 1,
          <button 
            onClick={() => navigate(`/profile?student_id=${s.id}`)}
            className="font-bold text-blue-700 hover:underline text-left"
          >
            {s.name}
          </button>,
          s.class_name || 'Tanpa Kelas',
          s.program_name || '-',
          s.phone || s.guardian_phone || '-',
          <StatusBadge value={statusText} />,
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/profile?student_id=${s.id}`)}
              className="text-slate-600 hover:text-blue-700 p-1"
              title="Lihat Profil"
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => handleOpenEdit(s)}
              className="text-slate-600 hover:text-amber-700 p-1"
              title="Edit Siswa"
            >
              <Edit size={16} />
            </button>
            {s.status === 'active' && (
              <button 
                onClick={() => handleDelete(s.id)}
                className="text-slate-600 hover:text-red-700 p-1"
                title="Nonaktifkan"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ];
      })
    : [];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Daftar Siswa Kursus"
        action={<PrimaryButton onClick={handleOpenAdd} icon={Plus}>Tambah Siswa</PrimaryButton>}
      >
        <div className="mb-5 flex flex-wrap gap-3">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="all">Semua Kelas</option>
            {classes && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="leave">Cuti</option>
            <option value="inactive">Nonaktif</option>
          </select>

          <label className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" 
              placeholder="Cari nama atau telepon..." 
            />
          </label>
        </div>

        {loadingStudents ? (
          <div className="py-12 text-center text-slate-500">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
            <span>Memuat data siswa...</span>
          </div>
        ) : tableRows.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <span>Tidak ada data siswa ditemukan.</span>
          </div>
        ) : (
          <DataTable columns={['No', 'Nama Siswa', 'Kelas', 'Program', 'No Telepon', 'Status', 'Aksi']} rows={tableRows} />
        )}
      </SectionCard>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Tambah Siswa Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap siswa"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">No. WhatsApp Siswa</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 0812xxxx"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal Masuk</label>
                  <input
                    type="date"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Wali / Orang Tua</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Nama orang tua/wali"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">No. WA Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="Contoh: 0812xxxx"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Program Kursus</label>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    {programs && programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kelas</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    <option value="">Tanpa Kelas</option>
                    {classes && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Catatan Khusus</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Kebutuhan khusus siswa, alergi, atau catatan lainnya..."
                  className="mt-1.5 h-16 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none"
                />
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
                  {createMutation.loading ? 'Menyimpan...' : 'Simpan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Ubah Data Siswa</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">No. WhatsApp Siswa</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    <option value="active">Aktif</option>
                    <option value="leave">Cuti</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Wali / Orang Tua</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">No. WA Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Program Kursus</label>
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    {programs && programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kelas</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    <option value="">Tanpa Kelas</option>
                    {classes && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Catatan Khusus</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1.5 h-16 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={updateMutation.loading}
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  {updateMutation.loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
