import { useState } from 'react';
import { LayoutGrid, Key, Hash, Calendar } from 'lucide-react';

interface TenantCard {
  id: string;
  name: string;
  tenantId: string;
  description: string;
  channel: string;
  createdAt: string;
}

const INITIAL_TENANTS: TenantCard[] = [
  {
    id: 't1',
    name: 'ThingsBoard Bot',
    tenantId: 'tnt_i03Fl4Goqu',
    description: 'IoT device management & telemetry',
    channel: 'WhatsApp',
    createdAt: 'Jun 25, 2026',
  },
  {
    id: 't2',
    name: 'BDA Sales Bot',
    tenantId: 'tnt_NdBSCgzDj1',
    description: 'Leads, targets & revenue tracking',
    channel: 'Web',
    createdAt: 'Jun 25, 2026',
  },
  {
    id: 't3',
    name: 'citygreen-bot',
    tenantId: '100021bc',
    description: 'City greens operations assistant',
    channel: 'Telegram',
    createdAt: 'Jun 19, 2026',
  },
];

export default function TenantsSection() {
  const [tenants] = useState<TenantCard[]>(INITIAL_TENANTS);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tenants</h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Auto-generated when you create an agent</p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm p-5 hover:shadow-md hover:border-zinc-300/60 dark:hover:border-zinc-700/60 transition-all duration-150"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center mb-3">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>

            {/* Name */}
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1 truncate">{tenant.name}</h3>

            {/* Description */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">{tenant.description}</p>

            {/* Meta */}
            <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Key className="w-3 h-3 shrink-0" />
                <span className="font-mono truncate">{tenant.tenantId}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Hash className="w-3 h-3 shrink-0" />
                <span>{tenant.channel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Created {tenant.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
