import { useState } from 'react';

interface NavGroup {
  group: string;
  items: string[];
}

const navGroups: NavGroup[] = [
  { group: 'Workspace', items: ['Overview', 'Analytics'] },
  { group: 'Resources', items: ['Tenants', 'Agents', 'ThingsBoard'] },
  { group: 'Activity', items: ['Sessions', 'Chat Logs'] },
];

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const activeGroup = navGroups.find((g) => g.items.includes(activePage));
    return activeGroup ? [activeGroup.group] : [navGroups[0].group];
  });

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  return (
    <aside className="w-60 h-screen bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-r-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 flex flex-col">
      <div className="px-6 py-5 border-b-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">Z</span>
        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Zigxo</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navGroups.map((g) => {
          const isOpen = openGroups.includes(g.group);
          return (
            <div key={g.group}>
              <button
                onClick={() => toggleGroup(g.group)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <span>{g.group}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ease-[cubic-bezier(0.25,1,0.2,1)] ${isOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              <div
                className={`grid transition-all duration-200 ease-[cubic-bezier(0.25,1,0.2,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1 pt-1 pb-1">
                    {g.items.map((item) => {
                      const isActive = activePage === item;
                      return (
                        <button
                          key={item}
                          onClick={() => onPageChange(item)}
                          className={
                            isActive
                              ? 'w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 transition-all duration-200 ease-[cubic-bezier(0.25,1,0.2,1)] hover:scale-[1.01] active:scale-[0.99]'
                              : 'w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 transition-all duration-200 ease-[cubic-bezier(0.25,1,0.2,1)] hover:scale-[1.01] active:scale-[0.99]'
                          }
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-semibold">AD</span>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Admin</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Super admin</p>
        </div>
      </div>
    </aside>
  );
}
