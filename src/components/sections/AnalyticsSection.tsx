import type { AnalyticsMetric } from '../../types';
interface Props { metrics: AnalyticsMetric[]; }

export default function AnalyticsSection({ metrics }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">{m.label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{m.value}</p>
          <span className={`text-xs font-medium mt-2 inline-block ${m.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {m.trend === 'up' ? '▲' : '▼'} {m.change}%
          </span>
        </div>
      ))}
    </div>
  );
}