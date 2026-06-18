import type { ReactNode } from 'react';
interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-tight">{title}</h3>}
      {children}
    </div>
  );
}