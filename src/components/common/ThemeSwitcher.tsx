import { useTheme } from '../../context/ThemeContext';

const options: { key: 'light' | 'dark' | 'system'; icon: string; label: string }[] = [
  { key: 'light', icon: '☀', label: 'Light' },
  { key: 'system', icon: '◐', label: 'Auto' },
  { key: 'dark', icon: '☾', label: 'Dark' },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-full bg-zinc-100/80 dark:bg-zinc-800/70 border-[0.5px] border-zinc-200/60 dark:border-zinc-700/50">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => setTheme(opt.key)}
          title={opt.label}
          aria-label={opt.label}
          className={
            theme === opt.key
              ? 'w-7 h-7 rounded-full flex items-center justify-center text-sm bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,1,0.2,1)]'
              : 'w-7 h-7 rounded-full flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.2,1)]'
          }
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}