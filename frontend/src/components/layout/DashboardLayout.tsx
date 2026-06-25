import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
  activePage: string;
  onPageChange: (page: string) => void;
  children: ReactNode;
}

export default function DashboardLayout({ activePage, onPageChange, children }: DashboardLayoutProps) {
  return (
    <div className="flex bg-white dark:bg-zinc-950 h-screen overflow-hidden transition-colors duration-300">
      <Sidebar activePage={activePage} onPageChange={onPageChange} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar activePage={activePage} />
        <main className="flex-1 p-6 bg-white dark:bg-zinc-950 overflow-y-auto transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
