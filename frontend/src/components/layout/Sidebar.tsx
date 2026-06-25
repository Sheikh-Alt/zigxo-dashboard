import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';
import {
  LayoutDashboard,
  BarChart2,
  Building2,
  Users,
  Bot,
  Cpu,
  Activity,
  MessageSquare,
  ChevronDown,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    group: 'WORKSPACE',
    items: [
      { label: 'Overview', icon: LayoutDashboard },
      { label: 'Analytics', icon: BarChart2 },
    ],
  },
  {
    group: 'RESOURCES',
    items: [
      { label: 'Tenants', icon: Building2 },
      { label: 'Users', icon: Users },
      { label: 'Agents', icon: Bot },
      { label: 'ThingsBoard', icon: Cpu },
    ],
  },
  {
    group: 'ACTIVITY',
    items: [
      { label: 'Sessions', icon: Activity },
      { label: 'Chat Logs', icon: MessageSquare },
    ],
  },
];

const MIN_WIDTH = 64;
const MAX_WIDTH = 320;
const DEFAULT_WIDTH = 240;
const COLLAPSE_THRESHOLD = 120;

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const activeGroup = navGroups.find((g) => g.items.some((i) => i.label === activePage));
    return activeGroup ? [activeGroup.group] : [navGroups[0].group];
  });

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const isCollapsed = sidebarWidth < COLLAPSE_THRESHOLD;

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <aside
      style={{ width: sidebarWidth }}
      className="relative h-screen bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-r border-zinc-200/50 dark:border-zinc-800/40 flex flex-col shrink-0"
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-zinc-200/50 dark:border-zinc-800/40 flex items-center gap-2.5 overflow-hidden">
        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
          Z
        </span>
        {!isCollapsed && (
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight whitespace-nowrap">
            Zigxo
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navGroups.map((g, gi) => {
          const isOpen = openGroups.includes(g.group);
          return (
            <div key={g.group} className={gi > 0 ? 'mt-3' : ''}>
              {/* Section header — hidden in collapsed/icon-only mode */}
              {!isCollapsed ? (
                <button
                  onClick={() => toggleGroup(g.group)}
                  className="w-full flex items-center justify-between px-4 py-1 mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-150"
                >
                  <span>{g.group}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ease-[cubic-bezier(0.25,1,0.2,1)] ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                gi > 0 && (
                  <div className="mx-3 my-1 border-t border-zinc-200/60 dark:border-zinc-800/50" />
                )
              )}

              {/* Expanded: animated accordion */}
              {!isCollapsed ? (
                <div
                  className={`grid transition-all duration-200 ease-[cubic-bezier(0.25,1,0.2,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-0.5 px-2 pt-0.5 pb-1">
                      {g.items.map((item) => {
                        const isActive = activePage === item.label;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            onClick={() => onPageChange(item.label)}
                            className={`relative w-full flex items-center gap-3 pl-3 pr-2 py-2 rounded-lg text-sm transition-all duration-150 ${
                              isActive
                                ? 'bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium'
                            }`}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />
                            )}
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Collapsed: icon-only, all groups always visible */
                <div className="space-y-0.5 px-2 pt-0.5">
                  {g.items.map((item) => {
                    const isActive = activePage === item.label;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => onPageChange(item.label)}
                        title={item.label}
                        className={`relative w-full flex items-center justify-center p-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive
                            ? 'bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                            : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />
                        )}
                        <Icon className="w-5 h-5 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Profile — anchored to bottom */}
      <div className="border-t border-zinc-200/70 dark:border-zinc-800/60 px-3 py-3 flex items-center gap-2.5 overflow-hidden">
        <span className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-semibold shrink-0">
          AD
        </span>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">Admin</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">Super admin</p>
          </div>
        )}
        <button
          title="Settings"
          className="shrink-0 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors duration-150"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Drag-resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize group z-10"
      >
        <div className="absolute inset-y-0 right-0 w-px group-hover:bg-indigo-400/50 group-active:bg-indigo-500/70 transition-colors duration-150" />
      </div>
    </aside>
  );
}
