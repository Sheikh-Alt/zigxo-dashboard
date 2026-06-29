import { AlertTriangle, Info, AlertCircle, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { OverviewKPI, AlertItem, RecentTenantRow, RecentUserRow } from '../../types';

const kpiAccentBars = ['bg-indigo-500', 'bg-purple-500', 'bg-sky-500', 'bg-emerald-500'];

const alertConfig: Record<AlertItem['severity'], { icon: LucideIcon; bg: string; text: string; border: string }> = {
  critical: {
    icon: AlertCircle,
    bg: 'bg-red-50 dark:bg-red-500/10',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200/60 dark:border-red-500/20',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200/60 dark:border-amber-500/20',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200/60 dark:border-blue-500/20',
  },
};

interface Props {
  kpis: OverviewKPI[];
  alerts: AlertItem[];
  recentTenants: RecentTenantRow[];
  recentUsers: RecentUserRow[];
  onViewAllTenants: () => void;
  onViewAllUsers: () => void;
}

export default function OverviewSection({ kpis, alerts, recentTenants, recentUsers, onViewAllTenants, onViewAllUsers }: Props) {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const deltaColor =
            kpi.status === 'good'
              ? 'text-emerald-600 dark:text-emerald-400'
              : kpi.status === 'warning'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400';

          return (
            <div
              key={kpi.id}
              className="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/60 rounded-xl shadow-sm p-5 overflow-hidden"
            >
              <div className={`absolute inset-y-0 left-0 w-1 rounded-l-xl ${kpiAccentBars[i % 4]}`} />
              <p className="pl-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                {kpi.label}
              </p>
              <p className="pl-3 mt-2 text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                {kpi.value}
              </p>
              <p className={`pl-3 mt-1.5 text-xs font-medium ${deltaColor}`}>{kpi.delta}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts / Needs Attention Row */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          Needs Attention
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {alerts.map((alert) => {
            const { icon: SeverityIcon, bg, text, border } = alertConfig[alert.severity];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 rounded-xl border p-4 ${bg} ${border}`}
              >
                <SeverityIcon className={`w-4 h-4 mt-0.5 shrink-0 ${text}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-snug ${text}`}>{alert.message}</p>
                  <p className="text-xs mt-1 text-zinc-400 dark:text-zinc-500">{alert.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini-Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Tenants */}
        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/40">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Top 5 Recent Tenants</h3>
            <button
              onClick={onViewAllTenants}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500 border-b border-zinc-200/40 dark:border-zinc-800/30">
                <th className="text-left px-5 py-2.5 font-medium">Tenant</th>
                <th className="text-left px-3 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/60 dark:divide-zinc-800/40">
              {recentTenants.slice(0, 5).map((t) => (
                <tr key={t.tenantId} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors duration-100">
                  <td className="px-5 py-3">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[160px]">{t.tenantName}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{t.tenantId}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        t.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      {t.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Users */}
        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/40">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Top 5 Recent Users</h3>
            <button
              onClick={onViewAllUsers}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-zinc-400 dark:text-zinc-500 border-b border-zinc-200/40 dark:border-zinc-800/30">
                <th className="text-left px-5 py-2.5 font-medium">User</th>
                <th className="text-left px-3 py-2.5 font-medium">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/60 dark:divide-zinc-800/40">
              {recentUsers.slice(0, 5).map((u) => (
                <tr key={u.userId} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors duration-100">
                  <td className="px-5 py-3">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[160px]">{u.userName}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate max-w-[160px]">{u.email}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{u.lastActive}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
