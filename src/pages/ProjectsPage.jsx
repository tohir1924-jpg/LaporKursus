import { useState, useEffect } from 'react';
import { Plus, X, FolderKanban, Link as LinkIcon, CheckCircle2, ChevronRight } from 'lucide-react';
import { useQuery, useMutation } from '../hooks/useApi';
import { api } from '../lib/apiClient';
import { DataTable, PrimaryButton, ProgressBar, SectionCard, StatusBadge } from '../components/ui';

export function ProjectsPage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Form states - Create Project
  const [newStudentId, setNewStudentId] = useState('');
  const [newClassId, setNewClassId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [newLink, setNewLink] = useState('');

  // Form states - Add Progress Report
  const [repProgress, setRepProgress] = useState(0);
  const [repStatus, setRepStatus] = useState('in_progress');
  const [repNote, setRepNote] = useState('');
  const [repNextTarget, setRepNextTarget] = useState('');
  const [repFeedback, setRepFeedback] = useState('');

  // 1. Fetch data
  const { data: classes } = useQuery('/classes');
  const { data: students } = useQuery('/students?status=active');
  const { data: projects, loading: loadingProjects, refetch: refetchProjects } = useQuery(
    `/projects?${selectedClass !== 'all' ? `class_id=${selectedClass}&` : ''}${selectedStatus !== 'all' ? `status=${selectedStatus}` : ''}`
  );

  // 2. Fetch project reports history if a project is active
  const { data: reports, refetch: refetchReports } = useQuery(
    activeProjectId ? `/projects/${activeProjectId}/reports` : '',
    {},
    !activeProjectId
  );

  // Set default form class when classes loaded
  useEffect(() => {
    if (classes && classes.length > 0 && !newClassId) {
      setNewClassId(classes[0].id);
    }
  }, [classes]);

  useEffect(() => {
    if (students && students.length > 0 && !newStudentId) {
      setNewStudentId(students[0].id);
    }
  }, [students]);

  // Set default active project when projects loaded
  useEffect(() => {
    if (projects && projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects]);

  // 3. Mutations
  const createProjectMutation = useMutation((payload) => api.post('/projects', payload));
  const addReportMutation = useMutation(({ prjId, payload }) => api.post(`/projects/${prjId}/reports`, payload));

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProjectMutation.mutate({
        student_id: newStudentId,
        class_id: newClassId,
        title: newTitle,
        description: newDescription,
        start_date: new Date().toISOString().split('T')[0],
        target_date: newTargetDate,
        status: 'not_started',
        progress: 0,
        project_link: newLink
      });
      setShowAddModal(false);
      refetchProjects();
      alert('Project berhasil ditambahkan!');
    } catch (err) {
      alert(err.message || 'Gagal menambahkan project');
    }
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    try {
      await addReportMutation.mutate({
        prjId: activeProjectId,
        payload: {
          report_date: new Date().toISOString().split('T')[0],
          progress: Number(repProgress),
          status: repStatus,
          teacher_note: repNote,
          next_target: repNextTarget,
          feedback: repFeedback
        }
      });
      setShowUpdateModal(false);
      refetchProjects();
      refetchReports();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan laporan');
    }
  };

  const handleOpenUpdate = (project) => {
    setRepProgress(project.progress);
    setRepStatus(project.status);
    setRepNote('');
    setRepNextTarget('');
    setRepFeedback('');
    setShowUpdateModal(true);
  };

  // Find currently active project detail
  const activeProject = projects ? projects.find(p => p.id === activeProjectId) : null;
  const latestReport = reports && reports.length > 0 ? reports[0] : null;

  const tableRows = projects 
    ? projects.map((p, i) => {
        const isSelected = p.id === activeProjectId;
        const statusText = p.status === 'not_started' ? 'Belum Mulai' : p.status === 'in_progress' ? 'Proses' : p.status === 'revision' ? 'Revisi' : 'Selesai';
        return [
          i + 1,
          <button 
            onClick={() => setActiveProjectId(p.id)} 
            className={`font-semibold text-left transition hover:text-blue-700 ${isSelected ? 'text-blue-600 underline' : 'text-slate-900'}`}
          >
            {p.student_name}
          </button>,
          p.title,
          <div className="flex min-w-[150px] items-center gap-3">
            <span className="w-9 text-xs font-semibold text-slate-700">{p.progress}%</span>
            <ProgressBar value={p.progress} accent={p.progress === 100 ? 'green' : p.status === 'revision' ? 'orange' : 'blue'} />
          </div>,
          <StatusBadge value={statusText} />,
          p.class_name || '-',
          p.target_date || '-'
        ];
      })
    : [];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Laporan Project Siswa"
        action={<PrimaryButton onClick={() => setShowAddModal(true)} icon={Plus}>Tambah Project</PrimaryButton>}
      >
        <div className="mb-5 flex flex-wrap gap-3">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">Semua Kelas</option>
            {classes && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">Semua Status</option>
            <option value="not_started">Belum Mulai</option>
            <option value="in_progress">Proses</option>
            <option value="revision">Revisi</option>
            <option value="done">Selesai</option>
          </select>
        </div>

        {loadingProjects ? (
          <div className="py-12 text-center text-slate-500">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
            <span>Memuat data project...</span>
          </div>
        ) : tableRows.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <span>Tidak ada data project ditemukan. Silakan tambahkan project baru.</span>
          </div>
        ) : (
          <DataTable columns={['No', 'Siswa', 'Project', 'Progress', 'Status', 'Kelas', 'Deadline']} rows={tableRows} />
        )}
      </SectionCard>

      {/* Selected Project Detail Panel */}
      {activeProject && (
        <SectionCard 
          title="Detail Project Terpilih"
          action={
            <button 
              onClick={() => handleOpenUpdate(activeProject)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3.5 py-2 rounded-xl transition hover:bg-blue-100/50"
            >
              Update Progress & Catatan
            </button>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr_1.1fr]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {activeProject.student_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">{activeProject.student_name}</p>
                <p className="mt-1 text-sm text-slate-500">{activeProject.class_name || 'Tanpa Kelas'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Judul Project</p>
              <p className="mt-1.5 font-bold text-slate-950 text-base">{activeProject.title}</p>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">{activeProject.description || 'Tidak ada deskripsi'}</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm font-bold text-blue-700">{activeProject.progress}%</span>
                <StatusBadge value={activeProject.status === 'not_started' ? 'Belum Mulai' : activeProject.status === 'in_progress' ? 'Proses' : activeProject.status === 'revision' ? 'Revisi' : 'Selesai'} />
              </div>
              <div className="mt-3"><ProgressBar value={activeProject.progress} /></div>
              
              {activeProject.project_link && (
                <a 
                  href={activeProject.project_link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
                >
                  <LinkIcon size={14} />
                  Buka Link Hasil Project
                </a>
              )}
            </div>
            
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="font-bold text-slate-950 text-sm">Catatan Mentor Terbaru</p>
              <p className="mt-2 text-xs leading-5 text-slate-600 italic">
                "{latestReport?.teacher_note || 'Belum ada catatan mentor'}"
              </p>
              
              <p className="mt-4 font-bold text-slate-950 text-sm">Target Berikutnya</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                {latestReport?.next_target || 'Belum ditentukan'}
              </p>

              <p className="mt-4 font-bold text-slate-950 text-sm">Feedback untuk Orang Tua</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                {latestReport?.feedback || 'Belum diberikan'}
              </p>
              
              <div className="mt-4 border-t border-slate-200/60 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Deadline: <span className="font-bold text-slate-800">{activeProject.target_date || '-'}</span></span>
                <span>Oleh: <span className="font-bold text-slate-800">{latestReport?.teacher_name || '-'}</span></span>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Tambah Project Siswa</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Siswa</label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  required
                >
                  {students && students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kelas</label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  required
                >
                  {classes && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Judul Project</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Redesign Landing Page Toko Online"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deskripsi</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Penjelasan ringkas tentang project..."
                  className="mt-1.5 h-20 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Selesai</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Link Project (Opsional)</label>
                  <input
                    type="url"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="https://..."
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
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
                  disabled={createProjectMutation.loading}
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  {createProjectMutation.loading ? 'Menyimpan...' : 'Simpan Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Progress & Notes Modal */}
      {showUpdateModal && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Update Progress & Catatan Mentor</h3>
              <button onClick={() => setShowUpdateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
              <p className="font-semibold text-slate-900">{activeProject.student_name}</p>
              <p className="mt-0.5 text-slate-500">Project: {activeProject.title}</p>
            </div>
            <form onSubmit={handleAddReport} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Progress (%)</label>
                  <input
                    type="number"
                    value={repProgress}
                    onChange={(e) => setRepProgress(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                    required
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
                  <select
                    value={repStatus}
                    onChange={(e) => setRepStatus(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    <option value="not_started">Belum Mulai</option>
                    <option value="in_progress">Proses</option>
                    <option value="revision">Revisi</option>
                    <option value="done">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Catatan Mentor</label>
                <textarea
                  value={repNote}
                  onChange={(e) => setRepNote(e.target.value)}
                  placeholder="Tulis kritik konstruktif atau catatan tentang progres..."
                  className="mt-1.5 h-16 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Berikutnya</label>
                <input
                  type="text"
                  value={repNextTarget}
                  onChange={(e) => setRepNextTarget(e.target.value)}
                  placeholder="Target kerja untuk pertemuan depan..."
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Feedback untuk Orang Tua</label>
                <textarea
                  value={repFeedback}
                  onChange={(e) => setRepFeedback(e.target.value)}
                  placeholder="Laporan perkembangan project siswa agar diketahui orang tua/wali..."
                  className="mt-1.5 h-16 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowUpdateModal(false)}
                  className="h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={addReportMutation.loading}
                  className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  {addReportMutation.loading ? 'Menyimpan...' : 'Simpan Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
