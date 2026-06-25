import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-[cubic-bezier(0.25,1,0.2,1)] hover:scale-[1.01] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants: Record<string, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:active:bg-indigo-600 focus-visible:ring-indigo-500 shadow-sm',
    secondary: 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-[0.5px] border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:bg-zinc-100 dark:active:bg-zinc-600 focus-visible:ring-zinc-400 shadow-sm',
    ghost: 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 dark:active:bg-zinc-700 focus-visible:ring-zinc-400',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
