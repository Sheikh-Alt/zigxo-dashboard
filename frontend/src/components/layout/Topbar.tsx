import ThemeSwitcher from '../common/ThemeSwitcher';

const breadcrumbMap: Record<string, string> = {
  Overview: 'Workspace',
  Analytics: 'Workspace',
  Tenants: 'Resources',
  Agents: 'Resources',
  ThingsBoard: 'Resources',
  Sessions: 'Activity',
  'Chat Logs': 'Activity',
  Users: 'Resources',
};

interface TopbarProps {
  activePage: string;
}

export default function Topbar({ activePage }: TopbarProps) {
  const group = breadcrumbMap[activePage] ?? '';

  return (
    <header className="h-16 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-b-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 flex items-center gap-4 px-6 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 shrink-0">
        {group && <span className="text-zinc-400 dark:text-zinc-500 font-normal">{group} / </span>}
        {activePage}
      </h1>

      <div className="flex items-center gap-3 shrink-0 ml-auto">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
