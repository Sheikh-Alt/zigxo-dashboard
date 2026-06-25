import ThemeSwitcher from '../common/ThemeSwitcher';

const breadcrumbMap: Record<string, string> = {
  Overview: 'Workspace',
  Analytics: 'Workspace',
  Tenants: 'Resources',
  Agents: 'Resources',
  ThingsBoard: 'Resources',
  Sessions: 'Activity',
  'Chat Logs': 'Activity',
};

interface TopbarProps {
  activePage: string;
}

export default function Topbar({ activePage }: TopbarProps) {
  const group = breadcrumbMap[activePage] ?? '';

  return (
    <header className="h-16 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-b-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {group && <span className="text-zinc-400 dark:text-zinc-500 font-normal">{group} / </span>}
        {activePage}
      </h1>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-semibold">
          AS
        </div>
      </div>
    </header>
  );
}
