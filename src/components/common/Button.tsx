import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.25,1,0.2,1)] hover:scale-[1.01] active:scale-[0.99]';
  const variants: Record<string, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400',
    secondary: 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-[0.5px] border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700',
    ghost: 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}