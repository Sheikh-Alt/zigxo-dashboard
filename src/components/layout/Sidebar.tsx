const navItems = ['Overview', 'Users', 'Tenants', 'Devices', 'Leads', 'Sessions', 'Chat Logs', 'Analytics'];

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-lg font-bold text-indigo-600">Zigxo</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={
              activePage === item
                ? 'w-full text-left block px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700'
                : 'w-full text-left block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50'
            }
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400">v1.0.0 - Admin Console</div>
    </aside>
  );
}
