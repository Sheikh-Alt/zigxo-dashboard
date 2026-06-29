import { useState } from 'react';
import { Search, Activity } from 'lucide-react';

interface SessionRow {
  sessionId: string;
  userName: string;
  agentName: string;
  channel: string;
  startedAt: string;
  duration: string;
  status: 'active' | 'ended';
}

const SESSIONS: SessionRow[] = [
  { sessionId: 'SES-9087', userName: 'Ananya Sharma',  agentName: 'Zigxo Assistant',  channel: 'WhatsApp', startedAt: '2026-06-25  09:05', duration: '12m 34s', status: 'active'  },
  { sessionId: 'SES-9086', userName: 'Rohan Mehta',    agentName: 'BDA Sales Bot',     channel: 'Web',      startedAt: '2026-06-25  08:52', duration: '5m 10s',  status: 'active'  },
  { sessionId: 'SES-9085', userName: 'Priya Nair',     agentName: 'ThingsBoard Bot',   channel: 'WhatsApp', startedAt: '2026-06-25  08:30', duration: '3m 45s',  status: 'ended'   },
  { sessionId: 'SES-9084', userName: 'Karan Desai',    agentName: 'citygreen-bot',     channel: 'Telegram', startedAt: '2026-06-25  08:11', duration: '8m 02s',  status: 'ended'   },
  { sessionId: 'SES-9083', userName: 'Fatima Malik',   agentName: 'BDA Sales Bot',     channel: 'Web',      startedAt: '2026-06-25  07:58', duration: '15m 21s', status: 'ended'   },
  { sessionId: 'SES-9082', userName: 'Dev Chandna',    agentName: 'ThingsBoard Bot',   channel: 'WhatsApp', startedAt: '2026-06-24  18:44', duration: '2m 09s',  status: 'ended'   },
  { sessionId: 'SES-9081', userName: 'Sneha Kapoor',   agentName: 'citygreen-bot',     channel: 'Telegram', startedAt: '2026-06-24  17:30', duration: '6m 55s',  status: 'ended'   },
  { sessionId: 'SES-9080', userName: 'Arjun Pillai',   agentName: 'Zigxo Assistant',   channel: 'WhatsApp', startedAt: '2026-06-24  16:05', duration: '9m 14s',  status: 'ended'   },
];

const CHANNEL_DOT: Record<string, string> = {
  WhatsApp: 'bg-emerald-500',
  Web:      'bg-blue-500',
  Telegram: 'bg-sky-500',
};

export default function SessionsListSection() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'ended'>('all');

  const filtered = SESSIONS.filter((s) => {
    const matchesQuery =
      s.sessionId.toLowerCase().includes(query.toLowerCase()) ||
      s.userName.toLowerCase().includes(query.toLowerCase()) ||
      s.agentName.toLowerCase().includes(query.toLowerCase()) ||
      s.channel.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const activeCount = SESSIONS.filter((s) => s.status === 'active').length;

  return (
    <div className="space-y-4">
      {/* Header + KPI strip */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sessions</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">{SESSIONS.length} total · <span className="text-emerald-600 dark:text-emerald-400 font-medium">{activeCount} active</span></p>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm">

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-zinc-200/50 dark:border-zinc-800/40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sessions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/40 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-48 transition"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex gap-1 p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg border border-zinc-200/60 dark:border-zinc-700/50">
            {(['all', 'active', 'ended'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 capitalize ${
                  statusFilter === f
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Ended'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500 border-b border-zinc-200/40 dark:border-zinc-800/30">
                <th className="text-left px-5 py-3 font-medium">Session</th>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Agent</th>
                <th className="text-left px-4 py-3 font-medium">Channel</th>
                <th className="text-left px-4 py-3 font-medium">Started</th>
                <th className="text-left px-4 py-3 font-medium">Duration</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/60 dark:divide-zinc-800/40">
              {filtered.map((s) => (
                <tr key={s.sessionId} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors duration-100">

                  {/* Session ID */}
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-zinc-600 dark:text-zinc-300">{s.sessionId}</span>
                  </td>

                  {/* User */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{s.userName}</span>
                  </td>

                  {/* Agent */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-zinc-600 dark:text-zinc-300">{s.agentName}</span>
                  </td>

                  {/* Channel */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${CHANNEL_DOT[s.channel] ?? 'bg-zinc-400'}`} />
                      {s.channel}
                    </span>
                  </td>

                  {/* Started */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">{s.startedAt}</span>
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{s.duration}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        s.status === 'active'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-zinc-400 dark:text-zinc-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300 dark:bg-zinc-600'
                        }`}
                      />
                      {s.status === 'active' ? 'Active' : 'Ended'}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <p className="text-sm text-zinc-400 dark:text-zinc-500">No sessions match your filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
