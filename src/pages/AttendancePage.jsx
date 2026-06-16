import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '../hooks/useApi';
import { api } from '../lib/apiClient';
import { PrimaryButton, SectionCard } from '../components/ui';

export function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // 1. Fetch active classes
  const { data: classes } = useQuery('/classes');

  // Set first class as default when loaded
  useEffect(() => {
    if (classes && classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  // 2. Fetch attendance or students in selected class
  const { data: attendanceData, loading: loadingAttendance, refetch } = useQuery(
    selectedClass ? `/attendance?class_id=${selectedClass}&date=${selectedDate}` : '',
    {},
    !selectedClass
  );

  const { data: classStudents } = useQuery(
    selectedClass ? `/students?class_id=${selectedClass}&status=active` : '',
    {},
    !selectedClass
  );

  // Synchronize records state
  useEffect(() => {
    setSaveSuccess('');
    setSaveError('');

    if (!selectedClass) return;

    // If attendance exists for the day, load it
    if (attendanceData && attendanceData.length > 0) {
      const formatted = attendanceData.map(att => ({
        student_id: att.student_id,
        name: att.student_name,
        status: att.status,
        late_minutes: att.late_minutes || 0,
        note: att.note || '',
      }));
      setRecords(formatted);
    } 
    // Otherwise, default all active students in the class to 'H' (Hadir)
    else if (classStudents) {
      const formatted = classStudents.map(student => ({
        student_id: student.id,
        name: student.name,
        status: 'H',
        late_minutes: 0,
        note: '',
      }));
      setRecords(formatted);
    }
  }, [attendanceData, classStudents, selectedClass, selectedDate]);

  // 3. Save mutation
  const saveMutation = useMutation((payload) => api.post('/attendance/bulk', payload));

  const handleStatusChange = (studentId, status) => {
    setRecords(prev =>
      prev.map(rec => (rec.student_id === studentId ? { ...rec, status } : rec))
    );
  };

  const handleNoteChange = (studentId, note) => {
    setRecords(prev =>
      prev.map(rec => (rec.student_id === studentId ? { ...rec, note } : rec))
    );
  };

  const handleLateMinutesChange = (studentId, mins) => {
    setRecords(prev =>
      prev.map(rec => (rec.student_id === studentId ? { ...rec, late_minutes: Number(mins) || 0 } : rec))
    );
  };

  const handleSave = async () => {
    setSaveSuccess('');
    setSaveError('');

    try {
      await saveMutation.mutate({
        class_id: selectedClass,
        attendance_date: selectedDate,
        records: records.map(rec => ({
          student_id: rec.student_id,
          status: rec.status,
          late_minutes: rec.status === 'T' ? rec.late_minutes : 0,
          note: rec.note
        }))
      });
      setSaveSuccess('Absensi berhasil disimpan!');
      refetch();
    } catch (err) {
      setSaveError(err.message || 'Gagal menyimpan absensi');
    }
  };

  const statusOptions = [
    { code: 'H', label: 'Hadir', bg: 'bg-green-100 text-green-800 border-green-200', activeBg: 'bg-green-600 text-white border-green-600' },
    { code: 'A', label: 'Alpa', bg: 'bg-red-100 text-red-800 border-red-200', activeBg: 'bg-red-600 text-white border-red-600' },
    { code: 'I', label: 'Izin', bg: 'bg-blue-100 text-blue-800 border-blue-200', activeBg: 'bg-blue-600 text-white border-blue-600' },
    { code: 'T', label: 'Telat', bg: 'bg-orange-100 text-orange-800 border-orange-200', activeBg: 'bg-orange-600 text-white border-orange-600' }
  ];

  return (
    <SectionCard title="Absensi Kehadiran">
      <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kelas</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          >
            {classes && classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            {!classes && <option>Memuat kelas...</option>}
          </select>
        </div>

        <div className="mt-6 flex flex-1 justify-end">
          <PrimaryButton 
            onClick={handleSave} 
            icon={CheckCircle2} 
            disabled={saveMutation.loading || records.length === 0}
          >
            {saveMutation.loading ? 'Menyimpan...' : 'Simpan Absensi'}
          </PrimaryButton>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 font-medium">
          {saveSuccess}
        </div>
      )}

      {saveError && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 font-medium flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{saveError}</span>
        </div>
      )}

      {loadingAttendance ? (
        <div className="py-12 text-center text-slate-500">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-3" />
          <span>Memuat data absensi...</span>
        </div>
      ) : records.length === 0 ? (
        <div className="py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <span>Tidak ada siswa aktif di kelas yang dipilih.</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Nama Siswa</th>
                <th className="px-6 py-3 font-semibold text-center">Status Kehadiran</th>
                <th className="px-6 py-3 font-semibold">Catatan / Keterlambatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((rec) => (
                <tr key={rec.student_id} className="transition hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{rec.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {statusOptions.map(opt => {
                        const isSelected = rec.status === opt.code;
                        return (
                          <button
                            key={opt.code}
                            type="button"
                            onClick={() => handleStatusChange(rec.student_id, opt.code)}
                            className={`flex h-9 min-w-12 items-center justify-center rounded-xl border text-xs font-bold transition-all shadow-sm ${isSelected ? opt.activeBg : `${opt.bg} hover:brightness-95`}`}
                          >
                            {opt.code}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {rec.status === 'T' && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <input
                            type="number"
                            placeholder="Menit"
                            value={rec.late_minutes || ''}
                            onChange={(e) => handleLateMinutesChange(rec.student_id, e.target.value)}
                            className="h-9 w-20 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5"
                          />
                          <span className="text-xs text-slate-500 font-medium">menit</span>
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Tambahkan catatan khusus..."
                        value={rec.note}
                        onChange={(e) => handleNoteChange(rec.student_id, e.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        {['H = Hadir (Tepat waktu)', 'A = Alpa (Tanpa keterangan)', 'I = Izin (Sakit / Berhalangan)', 'T = Telat (Keterlambatan menit)'].map((item) => (
          <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-500 text-xs">{item}</span>
        ))}
      </div>
    </SectionCard>
  );
}
