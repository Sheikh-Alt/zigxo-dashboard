import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm p-6 transition-all duration-150 hover:shadow-md hover:border-zinc-300/60 dark:hover:border-zinc-700/60 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">{title}</h3>}
      {children}
    </div>
  );
}
