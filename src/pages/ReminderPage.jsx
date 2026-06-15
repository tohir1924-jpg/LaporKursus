import { MessageCircle } from 'lucide-react';
import { messageTemplates, reminderMessage } from '../data/mockData';
import { PrimaryButton, SectionCard, SelectBox } from '../components/ui';

export function ReminderPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr_1fr]">
      <SectionCard title="Pilih Template">
        <div className="space-y-3">
          {messageTemplates.map(([title, subtitle], index) => (
            <button key={title} className={`w-full rounded-2xl border p-4 text-left transition ${index === 0 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'}`}>
              <p className="font-semibold">{title}</p>
              <p className={`mt-1 text-sm ${index === 0 ? 'text-blue-600' : 'text-slate-500'}`}>{subtitle}</p>
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Editor Pesan">
        <label className="text-sm font-semibold text-slate-700">Pesan</label>
        <textarea className="mt-2 min-h-[300px] w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm leading-6 text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" defaultValue={reminderMessage} />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-slate-500">176 / 500</p>
          <div className="flex flex-wrap justify-end gap-2">
            {['{nama_siswa}', '{nama_kursus}', '{kelas}', '{tanggal}'].map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item}</span>
            ))}
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Preview (WhatsApp)">
        <div className="rounded-2xl border border-green-100 bg-[#EEF8F1] p-4">
          <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-[#DCF8C6] p-4 text-sm leading-6 text-slate-800 shadow-sm">
            <p>Halo Andi Wijaya,</p>
            <p className="mt-3">Kami mencatat Anda belum hadir di beberapa pertemuan. Mohon untuk lebih memperhatikan kehadiran agar tidak mengganggu proses belajar Anda.</p>
            <p className="mt-3">Terima kasih atas perhatiannya.</p>
            <p className="mt-3">Salam,<br />Tim LaporKursus</p>
            <p className="mt-2 text-right text-xs text-slate-500">10:30 cek cek</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <label className="text-sm font-semibold text-slate-700">Kirim ke</label>
          <SelectBox>Siswa yang dipilih (5)</SelectBox>
          <PrimaryButton icon={MessageCircle} color="green">Kirim WhatsApp</PrimaryButton>
        </div>
      </SectionCard>
    </div>
  );
}
