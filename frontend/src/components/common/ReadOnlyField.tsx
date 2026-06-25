interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

export default function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
      <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}
