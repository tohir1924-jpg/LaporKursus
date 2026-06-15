import { students } from '../data/mockData';
import { PlaceholderInner, SectionCard } from '../components/ui';

export function PlaceholderPage({ title }) {
  return (
    <SectionCard title={title}>
      <PlaceholderInner title="Dalam pengembangan" />
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.slice(0, 6).map((name, index) => (
          <div key={name} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {name.split(' ').map((part) => part[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{name}</p>
                <p className="text-sm text-slate-500">{['Web Development - Pagi', 'UI/UX Design', 'Digital Marketing'][index % 3]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
