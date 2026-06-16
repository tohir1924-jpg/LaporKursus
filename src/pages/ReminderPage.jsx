import { useState, useEffect } from 'react';
import { MessageCircle, X, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '../hooks/useApi';
import { api } from '../lib/apiClient';
import { PrimaryButton, SectionCard } from '../components/ui';

export function ReminderPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [editorText, setEditorText] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [customContext, setCustomContext] = useState({
    month: 'Juni',
    year: '2026',
    nominal_spp: '150000',
    status_project: 'proses',
    catatan_project: 'perlu merapikan tata letak CSS'
  });

  // 1. Fetch message templates
  const { data: templates, loading: loadingTemplates } = useQuery('/message-templates');

  // 2. Fetch students for selection dropdown
  const { data: students } = useQuery('/students?status=active');

  // Set defaults
  useEffect(() => {
    if (templates && templates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(templates[0].id);
      setEditorText(templates[0].content);
    }
  }, [templates]);

  useEffect(() => {
    if (students && students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students]);

  // 3. Trigger preview compilation
  const { data: previewData, refetch: refetchPreview } = useQuery(
    selectedTemplateId && selectedStudentId
      ? `/messages/preview`
      : '',
    {},
    true // Lazy load
  );

  // Perform client-side preview request
  const fetchPreview = async () => {
    if (!selectedTemplateId || !selectedStudentId) return;
    try {
      const res = await api.post('/messages/preview', {
        template_id: selectedTemplateId,
        student_id: selectedStudentId,
        context: customContext
      });
      if (res.success) {
        setPreviewText(res.message);
        setWhatsappUrl(res.whatsapp_url);
        setRecipientPhone(res.recipient_phone);
      }
    } catch (e) {
      console.error('Preview error:', e);
      setPreviewText('Gagal meresolusi variabel template. Pastikan database aktif.');
      setWhatsappUrl('');
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [selectedTemplateId, selectedStudentId, JSON.stringify(customContext)]);

  // 4. Log creation mutation
  const logMutation = useMutation((payload) => api.post('/messages/logs', payload));

  const handleSend = async () => {
    if (!whatsappUrl) {
      alert('Tujuan pengiriman tidak memiliki nomor WhatsApp valid.');
      return;
    }

    try {
      // Save log to D1
      await logMutation.mutate({
        student_id: selectedStudentId,
        template_id: selectedTemplateId,
        recipient_phone: recipientPhone,
        message_type: templates?.find(t => t.id === selectedTemplateId)?.type || 'general',
        message_content: previewText,
        status: 'sent_manual'
      });

      // Open WA tab
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Failed to log message:', err);
      // Fallback: still open WA even if logging fails
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleTemplateSelect = (tpl) => {
    setSelectedTemplateId(tpl.id);
    setEditorText(tpl.content);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr_1fr]">
      {/* Template List */}
      <SectionCard title="Pilih Template">
        {loadingTemplates ? (
          <div className="py-6 text-center text-slate-500">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-2" />
            <span>Memuat template...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {templates && templates.map((tpl) => {
              const isSelected = selectedTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => handleTemplateSelect(tpl)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold">{tpl.name}</p>
                  <p className={`mt-1 text-xs leading-4 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                    Tipe: <span className="font-semibold">{tpl.type}</span>
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Message Editor & Context */}
      <SectionCard title="Editor & Variabel">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pilih Siswa</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              {students && students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.class_name || 'Tanpa Kelas'})</option>
              ))}
              {!students && <option>Memuat daftar siswa...</option>}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Konten Template</label>
            <textarea
              readOnly
              className="mt-1.5 min-h-[150px] w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-500 outline-none"
              value={editorText}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Variabel Tambahan (SPP & Project)</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Bulan SPP"
                value={customContext.month}
                onChange={(e) => setCustomContext(prev => ({ ...prev, month: e.target.value }))}
                className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none"
              />
              <input
                type="number"
                placeholder="Nominal SPP"
                value={customContext.nominal_spp}
                onChange={(e) => setCustomContext(prev => ({ ...prev, nominal_spp: e.target.value }))}
                className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Status Project"
                value={customContext.status_project}
                onChange={(e) => setCustomContext(prev => ({ ...prev, status_project: e.target.value }))}
                className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Catatan Project"
                value={customContext.catatan_project}
                onChange={(e) => setCustomContext(prev => ({ ...prev, catatan_project: e.target.value }))}
                className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Live Preview (WhatsApp Mock) */}
      <SectionCard title="Preview WhatsApp">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-100 bg-[#EEF8F1] p-4 min-h-[200px]">
              <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-[#DCF8C6] p-4 text-sm leading-6 text-slate-800 shadow-sm whitespace-pre-line">
                {previewText || 'Memilih siswa untuk melihat preview...'}
              </div>
            </div>
            
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">Penerima Pesan:</p>
              <p className="mt-1">Nomor WhatsApp: <span className="font-bold text-slate-900">{recipientPhone || '(Tidak ada)'}</span></p>
            </div>
          </div>

          <div className="mt-5 space-y-3 pt-4 border-t border-slate-100">
            <PrimaryButton 
              onClick={handleSend} 
              icon={MessageCircle} 
              color="green"
              disabled={!whatsappUrl || logMutation.loading}
            >
              {logMutation.loading ? 'Mengirim...' : 'Kirim WhatsApp'}
            </PrimaryButton>
            <p className="text-[10px] text-center text-slate-400">
              Menekan tombol di atas akan membuka WhatsApp di tab baru dan menyimpan riwayat log pesan.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
