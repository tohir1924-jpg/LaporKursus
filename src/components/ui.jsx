import { ChevronDown } from 'lucide-react';

export const accentMap = {
  blue: { icon: 'bg-blue-100 text-blue-700', text: 'text-blue-700', bar: 'bg-blue-600' },
  green: { icon: 'bg-green-100 text-green-700', text: 'text-green-700', bar: 'bg-green-500' },
  orange: { icon: 'bg-orange-100 text-orange-700', text: 'text-orange-700', bar: 'bg-orange-500' },
  purple: { icon: 'bg-purple-100 text-purple-700', text: 'text-purple-700', bar: 'bg-purple-500' },
  red: { icon: 'bg-red-100 text-red-700', text: 'text-red-700', bar: 'bg-red-500' },
  teal: { icon: 'bg-teal-100 text-teal-700', text: 'text-teal-700', bar: 'bg-teal-500' },
  slate: { icon: 'bg-slate-100 text-slate-700', text: 'text-slate-700', bar: 'bg-slate-500' },
};

const statusStyles = {
  H: 'bg-green-100 text-green-700 border-green-200',
  A: 'bg-red-100 text-red-700 border-red-200',
  I: 'bg-blue-100 text-blue-700 border-blue-200',
  T: 'bg-orange-100 text-orange-700 border-orange-200',
  Lunas: 'bg-green-100 text-green-700 border-green-200',
  'Belum Lunas': 'bg-red-100 text-red-700 border-red-200',
  Sebagian: 'bg-orange-100 text-orange-700 border-orange-200',
  Proses: 'bg-blue-100 text-blue-700 border-blue-200',
  Revisi: 'bg-orange-100 text-orange-700 border-orange-200',
  Selesai: 'bg-green-100 text-green-700 border-green-200',
};

export function SectionCard({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ title, value, subtext, icon: Icon, accent }) {
  const colors = accentMap[accent];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
          <p className={`mt-2 text-sm font-medium ${colors.text}`}>{subtext}</p>
        </div>
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colors.icon}`}>
          <Icon size={23} />
        </span>
      </div>
    </div>
  );
}

export function StatusBadge({ value }) {
  return (
    <span className={`inline-flex min-w-9 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[value] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {value}
    </span>
  );
}

export function ProgressBar({ value, accent = 'blue' }) {
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${accentMap[accent].bar}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, index) => (
            <tr key={index} className="transition hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="whitespace-nowrap px-4 py-4 text-slate-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SelectBox({ children }) {
  return (
    <button className="inline-flex h-11 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
      <span>{children}</span>
      <ChevronDown size={16} className="text-slate-400" />
    </button>
  );
}

export function PrimaryButton({ children, icon: Icon, color = 'blue' }) {
  const styles = color === 'green' ? 'bg-green-500 hover:bg-green-600 focus:ring-green-100' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-100';
  return (
    <button className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 ${styles}`}>
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

export function PlaceholderInner({ title }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
        Modul ini sudah mendapat tempat di navigasi dan siap dikembangkan mengikuti schema Cloudflare D1 pada PRD.
      </p>
    </div>
  );
}
