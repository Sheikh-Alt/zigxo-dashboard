import type { AnalyticsMetric } from '../../types';

interface Props { metrics: AnalyticsMetric[]; }

export default function AnalyticsSection({ metrics }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.id} className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm p-5 transition-colors duration-300">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{m.label}</p>
          <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">{m.value}</p>
          <span className={`text-xs font-medium mt-2 inline-block ${m.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {m.trend === 'up' ? '▲' : '▼'} {m.change}%
          </span>
        </div>
      ))}
    </div>
  );
}
