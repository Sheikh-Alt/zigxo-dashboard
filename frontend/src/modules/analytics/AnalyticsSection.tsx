import { useState } from 'react';
import { startOfDay, subDays } from 'date-fns';
import type { AnalyticsMetric } from '../../types';
import GlobalDateRangePicker, { type DateRange } from '../../components/common/GlobalDateRangePicker';

interface Props { metrics: AnalyticsMetric[]; }

const historicalSummary: AnalyticsMetric[] = [
  { id: 'h1', label: 'Total Conversations', value: '14,320', change: 18.2, trend: 'up' },
  { id: 'h2', label: 'Avg Session Duration', value: '4m 32s', change: 6.5, trend: 'up' },
  { id: 'h3', label: 'Resolution Rate', value: '78.4%', change: 3.1, trend: 'up' },
  { id: 'h4', label: 'Avg Response Time', value: '1.9s', change: 12.0, trend: 'down' },
];

function MetricCard({ m, subtitle }: { m: AnalyticsMetric; subtitle?: string }) {
  const isUp = m.trend === 'up';
  return (
    <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm p-5 transition-colors duration-300">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{m.label}</p>
      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{m.value}</p>
      <span className={`text-xs font-medium mt-2 inline-block ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isUp ? '▲' : '▼'} {m.change}%{subtitle ? ` ${subtitle}` : ''}
      </span>
    </div>
  );
}

function ChartPlaceholder({ title, subtitle, tag, tagColor, icon }: {
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{subtitle}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tagColor}`}>{tag}</span>
      </div>
      <div className="h-48 rounded-lg bg-zinc-50/80 dark:bg-zinc-800/40 border border-dashed border-zinc-200 dark:border-zinc-700/50 flex flex-col items-center justify-center gap-2">
        <span className="text-zinc-300 dark:text-zinc-600">{icon}</span>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Chart Placeholder</p>
        <p className="text-xs text-zinc-300 dark:text-zinc-600">Connect a charting library to render data</p>
      </div>
    </div>
  );
}

export default function AnalyticsSection({ metrics }: Props) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: startOfDay(subDays(new Date(), 29)),
    end: startOfDay(new Date()),
  });

  return (
    <div className="space-y-6">
      {/* Page header with date picker */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Analytics</h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Platform-wide metrics and trends</p>
        </div>
        <GlobalDateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Current Live Snapshot — top, with pulsing dot and separator */}
      <div className="border-b border-zinc-200/70 dark:border-zinc-800/60 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Current Live Snapshot
          </h2>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {metrics.map((m) => <MetricCard key={m.id} m={m} />)}
        </div>
      </div>

      {/* Historical Summary */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          Historical Summary
        </h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {historicalSummary.map((m) => <MetricCard key={m.id} m={m} subtitle="vs prev period" />)}
        </div>
      </div>

      {/* Trend Charts */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          Trend Charts
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartPlaceholder
            title="User Growth"
            subtitle="Cumulative active users over the selected period"
            tag="Line Chart"
            tagColor="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            icon={
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          />
          <ChartPlaceholder
            title="API Usage"
            subtitle="Total API calls per day over the selected period"
            tag="Bar Chart"
            tagColor="bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
            icon={
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="12" width="4" height="9" />
                <rect x="9" y="7" width="4" height="14" />
                <rect x="15" y="4" width="4" height="17" />
                <line x1="1" y1="21" x2="23" y2="21" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
