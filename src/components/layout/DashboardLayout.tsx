import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
  title: string;
  activePage: string;
  onPageChange: (page: string) => void;
  children: ReactNode;
}

export default function DashboardLayout({ title, activePage, onPageChange, children }: DashboardLayoutProps) {
  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar activePage={activePage} onPageChange={onPageChange} />
      <div className="flex-1 flex flex-col">
        <Topbar title={title} />
        <main className="flex-1 p-6 bg-white overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
