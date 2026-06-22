interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

export default function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{value}</span>
    </div>
  );
}