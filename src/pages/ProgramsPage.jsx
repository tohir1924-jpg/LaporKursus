import { useState } from 'react';
import { Plus, X, Edit, Trash2, Award, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '../hooks/useApi';
import { api } from '../lib/apiClient';
import { DataTable, PrimaryButton, SectionCard, StatusBadge } from '../components/ui';

export function ProgramsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeProgram, setActiveProgram] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultFee, setDefaultFee] = useState('');
  const [status, setStatus] = useState('active');

  // 1. Fetch programs
  const { data: programs, loading: loadingPrograms, refetch: refetchPrograms } = useQuery('/programs?status=active');

  // 2. Mutations
  const createMutation = useMutation((payload) => api.post('/programs', payload));
  const updateMutation = useMutation(({ id, payload }) => api.put(`/programs/${id}`, payload));
  const deleteMutation = useMutation((id) => api.delete(`/programs/${id}`));

  const handleOpenAdd = () => {
    setName('');
    setDescription('');
    setDefaultFee('1000000');
    setShowAddModal(true);
  };

  const handleOpenEdit = (program) => {
    setActiveProgram(program);
    setName(program.name);
    setDescription(program.description || '');
    setDefaultFee(program.default_fee);
    setStatus(program.status || 'active');
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutate({
        name,
        description,
        default_fee: Number(defaultFee)
      });
      setShowAddModal(false);
      refetchPrograms();
    } catch (err) {
      alert(err.message || 'Gagal menambahkan program baru');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutate({
        id: activeProgram.id,
        payload: {
          name,
          description,
          default_fee: Number(defaultFee),
          status
        }
      });
      setShowEditModal(false);
      refetchPrograms();
    } catch (err) {
      alert(err.message || 'Gagal mengubah program');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan program kursus ini? Semua kelas di bawah program ini akan terpengaruh.')) return;
    try {
      await deleteMutation.mutate(id);
      refetchPrograms();
    } catch (err) {
      alert(err.message || 'Gagal menonaktifkan program');
    }
  };

  const tableRows = programs 
    ? programs.map((p, i) => [
        i + 1,
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Award size={18} className="text-blue-600" />
          <span>{p.name}</span>
        </div>,
        p.description || '-',
        `Rp ${p.default_fee.toLocaleString('id-ID')}`,
        <StatusBadge value={p.status === 'active' ? 'Aktif' : 'Nonaktif'} />,
        <div className="flex gap-2">
          <button 
            onClick={() => handleOpenEdit(p)}
            className="text-slate-600 hover:text-amber-700 p-1"
            title="Edit Program"
          >
            <Edit size={16} />
          </button>
          {p.status === 'active' && (
            <button 
              onClick={() => handleDelete(p.id)}
              className="text-slate-600 hover:text-red-700 p-1"
              title="Nonaktifkan"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ])
    : [];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Daftar Program Kursus"
        action={<PrimaryButton onClick={handleOpenAdd} icon={Plus}>Tambah Program</PrimaryButton>}
      >
        {loadingPrograms ? (
          <div className="py-12 text-center text-slate-500">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
            <span>Memuat data program...</span>
          </div>
        ) : tableRows.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <span>Belum ada data program terdaftar.</span>
          </div>
        ) : (
          <DataTable columns={['No', 'Nama Program', 'Deskripsi', 'Default SPP Bulanan', 'Status', 'Aksi']} rows={tableRows} />
        )}
      </SectionCard>

      {/* Add Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Tambah Program Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Program</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Web Development, Coding Kids"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Penjelasan ringkas tentang program kursus..."
                  className="mt-1.5 h-20 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Biaya Default SPP (Rp)</label>
                <input
                  type="number"
                  value={defaultFee}
                  onChange={(e) => setDefaultFee(e.target.value)}
                  placeholder="1000000"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  required
                  min="0"
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
                  {createMutation.loading ? 'Menyimpan...' : 'Simpan Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Program Modal */}
      {showEditModal && activeProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Ubah Program Kursus</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Program</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deskripsi</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 h-20 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">SPP Default (Rp)</label>
                  <input
                    type="number"
                    value={defaultFee}
                    onChange={(e) => setDefaultFee(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                    required
                    min="0"
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
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
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
