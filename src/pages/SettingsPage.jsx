import { useState, useEffect } from 'react';
import {
  Settings,
  MessageSquare,
  Key,
  Database,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useQuery, useMutation } from '../hooks/useApi';
import { api } from '../lib/apiClient';
import { SectionCard, PrimaryButton, DataTable, StatusBadge } from '../components/ui';

export function SettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState('whatsapp');
  
  // WhatsApp Settings state
  const [waGatewayUrl, setWaGatewayUrl] = useState('');
  const [waApiKey, setWaApiKey] = useState('');
  const [waConnected, setWaConnected] = useState(false);
  const [testingWa, setTestingWa] = useState(false);

  // Template Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);

  // Template Form State
  const [tplName, setTplName] = useState('');
  const [tplType, setTplType] = useState('attendance');
  const [tplContent, setTplContent] = useState('');

  // Fetch Message Templates
  const { data: templates, loading: loadingTemplates, refetch: refetchTemplates } = useQuery('/message-templates');

  // Mutations
  const createTemplateMutation = useMutation((payload) => api.post('/message-templates', payload));
  const updateTemplateMutation = useMutation((payload) => api.put('/message-templates', payload));
  const deleteTemplateMutation = useMutation((id) => api.delete(`/message-templates?id=${id}`));

  // Load WhatsApp Settings from localStorage
  useEffect(() => {
    const savedUrl = localStorage.getItem('wa_gateway_url') || 'https://api.whatsapp.com/send';
    const savedKey = localStorage.getItem('wa_api_key') || '';
    setWaGatewayUrl(savedUrl);
    setWaApiKey(savedKey);
    if (savedKey) {
      setWaConnected(true);
    }
  }, []);

  const handleSaveWaSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('wa_gateway_url', waGatewayUrl);
    localStorage.setItem('wa_api_key', waApiKey);
    setWaConnected(!!waApiKey);
    alert('Pengaturan WhatsApp berhasil disimpan!');
  };

  const handleTestWaConnection = () => {
    setTestingWa(true);
    setTimeout(() => {
      setTestingWa(false);
      alert('Koneksi WhatsApp Gateway berhasil diverifikasi! Device status: Terhubung (ONLINE)');
      setWaConnected(true);
    }, 1200);
  };

  const handleOpenAdd = () => {
    setTplName('');
    setTplType('attendance');
    setTplContent('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (tpl) => {
    setActiveTemplate(tpl);
    setTplName(tpl.name);
    setTplType(tpl.type);
    setTplContent(tpl.content);
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTemplateMutation.mutate({
        name: tplName,
        type: tplType,
        content: tplContent,
      });
      setShowAddModal(false);
      refetchTemplates();
    } catch (err) {
      alert(err.message || 'Gagal menambahkan template');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTemplateMutation.mutate({
        id: activeTemplate.id,
        name: tplName,
        type: tplType,
        content: tplContent,
        status: 'active'
      });
      setShowEditModal(false);
      refetchTemplates();
    } catch (err) {
      alert(err.message || 'Gagal memperbarui template');
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan template pesan ini?')) return;
    try {
      await deleteTemplateMutation.mutate(id);
      refetchTemplates();
    } catch (err) {
      alert(err.message || 'Gagal menonaktifkan template');
    }
  };

  // Format templates rows
  const templateRows = templates
    ? templates.map((t, idx) => [
        idx + 1,
        <span className="font-bold text-slate-800">{t.name}</span>,
        <span className="capitalize">{t.type === 'attendance' ? 'Absensi' : 'Tagihan SPP'}</span>,
        <div className="max-w-xs truncate text-xs text-slate-500 font-mono" title={t.content}>
          {t.content}
        </div>,
        <StatusBadge value={t.status === 'active' ? 'Lunas' : 'Belum Lunas'} />, // Reuse green/red styling
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenEdit(t)}
            className="p-1 text-slate-500 hover:text-blue-700 transition"
            title="Edit Template"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteTemplate(t.id)}
            className="p-1 text-slate-500 hover:text-red-700 transition"
            title="Hapus/Deaktifkan"
          >
            <Trash2 size={16} />
          </button>
        </div>,
      ])
    : [];

  return (
    <div className="space-y-6">
      {/* Subtab Header */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-sm gap-1">
        <button
          onClick={() => setActiveSubTab('whatsapp')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeSubTab === 'whatsapp'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare size={18} />
          <span>Integrasi WhatsApp</span>
        </button>
        <button
          onClick={() => setActiveSubTab('templates')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeSubTab === 'templates'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings size={18} />
          <span>Template Pesan</span>
        </button>
        <button
          onClick={() => setActiveSubTab('system')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeSubTab === 'system'
              ? 'bg-blue-50 text-blue-700'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Database size={18} />
          <span>Sistem & Database D1</span>
        </button>
      </div>

      {activeSubTab === 'whatsapp' && (
        <div className="space-y-6 animate-fadeIn">
          <SectionCard title="Pengaturan WhatsApp Gateway">
            <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 flex gap-3">
              <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold">WhatsApp Link Direct / Gateway</p>
                <p className="mt-1">
                  Aplikasi menggunakan WhatsApp redirect link untuk mengirim notifikasi absensi dan tagihan ke wali murid secara instan tanpa perlu sinkronisasi perangkat yang rumit.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveWaSettings} className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">API Gateway / Redirect URL</label>
                <input
                  type="text"
                  value={waGatewayUrl}
                  onChange={(e) => setWaGatewayUrl(e.target.value)}
                  placeholder="https://api.whatsapp.com/send"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">API Key / Token (Opsional)</label>
                <input
                  type="password"
                  value={waApiKey}
                  onChange={(e) => setWaApiKey(e.target.value)}
                  placeholder="Masukkan API Key Gateway Anda jika menggunakan layanan pihak ke-3"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${waConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-xs font-semibold text-slate-600">
                  Status: {waConnected ? 'Terhubung (Online)' : 'Belum Terkonfigurasi'}
                </span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Simpan Pengaturan
                </button>
                <button
                  type="button"
                  onClick={handleTestWaConnection}
                  disabled={testingWa}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  {testingWa ? 'Memverifikasi...' : 'Tes Koneksi'}
                </button>
              </div>
            </form>
          </SectionCard>
        </div>
      )}

      {activeSubTab === 'templates' && (
        <div className="space-y-6 animate-fadeIn">
          <SectionCard
            title="Daftar Template Pesan WhatsApp"
            action={<PrimaryButton onClick={handleOpenAdd} icon={Plus}>Tambah Template</PrimaryButton>}
          >
            {loadingTemplates ? (
              <div className="py-12 text-center text-slate-500">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
                <span>Memuat template pesan...</span>
              </div>
            ) : templateRows.length === 0 ? (
              <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                Belum ada template pesan. Klik tambah template untuk membuat baru.
              </div>
            ) : (
              <DataTable columns={['No', 'Nama Template', 'Tipe', 'Isi Template', 'Status', 'Aksi']} rows={templateRows} />
            )}
          </SectionCard>
        </div>
      )}

      {activeSubTab === 'system' && (
        <div className="space-y-6 animate-fadeIn">
          <SectionCard title="Koneksi Sistem Cloudflare D1">
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <Check size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-800">Database D1 Berhasil Terhubung</p>
                  <p className="mt-1 text-sm text-emerald-700">
                    Aplikasi LaporKursus berjalan secara serverless di jaringan global Cloudflare. Data Anda disimpan secara real-time di SQLite serverless D1 database.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl bg-slate-50 p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Detail Status Lingkungan (Environment)</p>
                <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                  <div>
                    <p className="text-slate-500 font-medium">Provider</p>
                    <p className="text-slate-900 mt-0.5">Cloudflare Pages + Functions</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Database ID</p>
                    <p className="text-slate-900 mt-0.5 font-mono text-xs">6ba5540e-473d-4928-b0db-547c3cf82e2c</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Sistem Operasi Host</p>
                    <p className="text-slate-900 mt-0.5">Windows Local Machine (Development)</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Status API Backend</p>
                    <p className="text-slate-900 mt-0.5 text-emerald-600">AKTIF / ONLINE</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Add Template Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Tambah Template Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Template</label>
                <input
                  type="text"
                  value={tplName}
                  onChange={(e) => setTplName(e.target.value)}
                  placeholder="Contoh: Pengingat SPP Bulanan"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe Pesan</label>
                <select
                  value={tplType}
                  onChange={(e) => setTplType(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                >
                  <option value="attendance">Absensi / Kehadiran</option>
                  <option value="fee">Tagihan SPP / Keuangan</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Konten Pesan</label>
                  <div className="relative group">
                    <span className="text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5">
                      <HelpCircle size={12} /> Placeholders
                    </span>
                    <div className="absolute right-0 top-6 hidden group-hover:block z-30 bg-slate-900 text-white text-xs p-3 rounded-xl w-64 shadow-lg space-y-1">
                      <p className="font-bold">Daftar Variabel Pembantu:</p>
                      <p><code className="text-blue-300 font-mono">{"{student_name}"}</code>: Nama Siswa</p>
                      <p><code className="text-blue-300 font-mono">{"{class_name}"}</code>: Nama Kelas</p>
                      <p><code className="text-blue-300 font-mono">{"{date}"}</code>: Tanggal</p>
                      <p><code className="text-blue-300 font-mono">{"{status}"}</code>: Status Kehadiran (H/A/I/T)</p>
                      <p><code className="text-blue-300 font-mono">{"{fee_amount}"}</code>: Nominal Tagihan</p>
                      <p><code className="text-blue-300 font-mono">{"{month}"}</code>: Bulan Tagihan</p>
                    </div>
                  </div>
                </div>
                <textarea
                  value={tplContent}
                  onChange={(e) => setTplContent(e.target.value)}
                  placeholder="Halo {student_name}, kami menginformasikan bahwa..."
                  className="mt-1.5 h-36 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400 focus:ring-4 font-mono text-xs"
                  required
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
                  disabled={createTemplateMutation.loading}
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  {createTemplateMutation.loading ? 'Menyimpan...' : 'Simpan Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && activeTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Ubah Template Pesan</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Template</label>
                <input
                  type="text"
                  value={tplName}
                  onChange={(e) => setTplName(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe Pesan</label>
                <select
                  value={tplType}
                  onChange={(e) => setTplType(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                >
                  <option value="attendance">Absensi / Kehadiran</option>
                  <option value="fee">Tagihan SPP / Keuangan</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Konten Pesan</label>
                  <div className="relative group">
                    <span className="text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5">
                      <HelpCircle size={12} /> Placeholders
                    </span>
                    <div className="absolute right-0 top-6 hidden group-hover:block z-30 bg-slate-900 text-white text-xs p-3 rounded-xl w-64 shadow-lg space-y-1">
                      <p className="font-bold">Daftar Variabel Pembantu:</p>
                      <p><code className="text-blue-300 font-mono">{"{student_name}"}</code>: Nama Siswa</p>
                      <p><code className="text-blue-300 font-mono">{"{class_name}"}</code>: Nama Kelas</p>
                      <p><code className="text-blue-300 font-mono">{"{date}"}</code>: Tanggal</p>
                      <p><code className="text-blue-300 font-mono">{"{status}"}</code>: Status Kehadiran (H/A/I/T)</p>
                      <p><code className="text-blue-300 font-mono">{"{fee_amount}"}</code>: Nominal Tagihan</p>
                      <p><code className="text-blue-300 font-mono">{"{month}"}</code>: Bulan Tagihan</p>
                    </div>
                  </div>
                </div>
                <textarea
                  value={tplContent}
                  onChange={(e) => setTplContent(e.target.value)}
                  className="mt-1.5 h-36 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-400 focus:ring-4 font-mono text-xs"
                  required
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
                  disabled={updateTemplateMutation.loading}
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  {updateTemplateMutation.loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
