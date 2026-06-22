interface ComingSoonCardProps {
  title: string;
}

export default function ComingSoonCard({ title }: ComingSoonCardProps) {
  return (
    <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm p-10 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center mb-4">
        <span className="text-indigo-600 dark:text-indigo-400 text-xl">•</span>
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">This view is being built and will be available soon.</p>
    </div>
  );
}