import { useState, useRef, useEffect } from 'react';
import {
  MoreVertical, X, Pencil, Trash2, Search, UserPlus,
} from 'lucide-react';

// ─── Local Types ──────────────────────────────────────────────────────────────

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  colorIndex: number;
  status: 'active' | 'suspended';
  lastActive: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  'bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-pink-500', 'bg-teal-500',
];

const SEED: ManagedUser[] = [
  { id: 'u-001', name: 'Ananya Sharma',  email: 'ananya@zigxo.io',  phone: '+91 98765 43210', initials: 'AS', colorIndex: 0, status: 'active',    lastActive: '2 min ago'   },
  { id: 'u-002', name: 'Rohan Mehta',    email: 'rohan@zigxo.io',   phone: '+91 99001 12345', initials: 'RM', colorIndex: 1, status: 'active',    lastActive: '1 hr ago'    },
  { id: 'u-003', name: 'Priya Nair',     email: 'priya@zigxo.io',   phone: '+91 88123 45678', initials: 'PN', colorIndex: 2, status: 'active',    lastActive: '3 hrs ago'   },
  { id: 'u-004', name: 'Karan Desai',    email: 'karan@zigxo.io',   phone: '+91 70000 99887', initials: 'KD', colorIndex: 3, status: 'suspended', lastActive: '5 days ago'  },
  { id: 'u-005', name: 'Fatima Malik',   email: 'fatima@zigxo.io',  phone: '+91 90090 11234', initials: 'FM', colorIndex: 4, status: 'active',    lastActive: '30 min ago'  },
  { id: 'u-006', name: 'Dev Chandna',    email: 'dev@zigxo.io',     phone: '+91 77778 88899', initials: 'DC', colorIndex: 5, status: 'active',    lastActive: 'Yesterday'   },
  { id: 'u-007', name: 'Sneha Kapoor',   email: 'sneha@zigxo.io',   phone: '+91 65432 10987', initials: 'SK', colorIndex: 6, status: 'active',    lastActive: '2 days ago'  },
  { id: 'u-008', name: 'Arjun Pillai',   email: 'arjun@zigxo.io',   phone: '+91 80090 22345', initials: 'AP', colorIndex: 7, status: 'suspended', lastActive: '10 days ago' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ initials, colorIndex }: { initials: string; colorIndex: number }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold text-white shrink-0 ${AVATAR_PALETTE[colorIndex % AVATAR_PALETTE.length]}`}
    >
      {initials}
    </span>
  );
}

function Field({ label, type = 'text', value, onChange }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UsersManagementSection() {
  const [users, setUsers] = useState<ManagedUser[]>(SEED);
  const [query, setQuery] = useState('');

  // Kebab menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const kebabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Edit drawer
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftPhone, setDraftPhone] = useState('');

  // Add User drawer
  const [adding, setAdding] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');

  // Delete confirmation
  const [deleting, setDeleting] = useState<ManagedUser | null>(null);

  // ── Click-outside handler ───────────────────────────────────────────────────
  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (openMenuId) {
        const btn = kebabRefs.current.get(openMenuId);
        const dd = menuDropdownRef.current;
        if (!btn?.contains(t) && !dd?.contains(t)) setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openMenuId]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const toggleMenu = (userId: string, btn: HTMLButtonElement) => {
    if (openMenuId === userId) { setOpenMenuId(null); return; }
    const rect = btn.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setOpenMenuId(userId);
  };

  const openEdit = (user: ManagedUser) => {
    setEditing(user);
    setDraftName(user.name);
    setDraftEmail(user.email);
    setDraftPhone(user.phone);
    setOpenMenuId(null);
  };

  const saveEdit = () => {
    if (!editing) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editing.id
          ? { ...u, name: draftName.trim() || u.name, email: draftEmail.trim() || u.email, phone: draftPhone.trim() || u.phone }
          : u
      )
    );
    setEditing(null);
  };

  const closeEdit = () => setEditing(null);

  const openDelete = (user: ManagedUser) => { setDeleting(user); setOpenMenuId(null); };
  const confirmDelete = () => {
    if (!deleting) return;
    setUsers((p) => p.filter((u) => u.id !== deleting.id));
    setDeleting(null);
  };

  const openAdd = () => {
    setAddName('');
    setAddEmail('');
    setAddPhone('');
    setAdding(true);
  };

  const saveAdd = () => {
    if (!addName.trim()) return;
    const initials = addName.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    const newUser: ManagedUser = {
      id: `u-${Date.now()}`,
      name: addName.trim(),
      email: addEmail.trim(),
      phone: addPhone.trim(),
      initials,
      colorIndex: users.length % AVATAR_PALETTE.length,
      status: 'active',
      lastActive: 'Just now',
    };
    setUsers((prev) => [newUser, ...prev]);
    setAdding(false);
  };

  const closeAdd = () => setAdding(false);

  const activeMenuUser = openMenuId ? users.find((u) => u.id === openMenuId) ?? null : null;

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Table Card ─────────────────────────────────────────────────────── */}
      <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/40">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Users</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{users.length} members total</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search users…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/40 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-44 transition"
              />
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors duration-150 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500 border-b border-zinc-200/40 dark:border-zinc-800/30">
                <th className="text-left px-6 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Contact</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Last Active</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/60 dark:divide-zinc-800/40">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors duration-100 group/row"
                >
                  {/* User */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={user.initials} colorIndex={user.colorIndex} />
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{user.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 truncate max-w-[180px]">{user.email}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{user.phone}</p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.status === 'active'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      {user.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  {/* Last Active */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">{user.lastActive}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end">
                      <button
                        ref={(el) => {
                          if (el) kebabRefs.current.set(user.id, el);
                          else kebabRefs.current.delete(user.id);
                        }}
                        onClick={(e) => toggleMenu(user.id, e.currentTarget)}
                        aria-label="Open actions"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 opacity-0 group-hover/row:opacity-100 focus:opacity-100 transition-all duration-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <p className="text-sm text-zinc-400 dark:text-zinc-500">No users match your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Action Dropdown (fixed) ──────────────────────────────────────────── */}
      {openMenuId && (
        <div
          ref={menuDropdownRef}
          className="fixed z-50 w-40 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-700/50 rounded-xl shadow-xl py-1"
          style={{ top: menuPos.top, right: menuPos.right }}
        >
          <button
            onClick={() => activeMenuUser && openEdit(activeMenuUser)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-zinc-400" />
            Edit User
          </button>
          <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
          <button
            onClick={() => activeMenuUser && openDelete(activeMenuUser)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete User
          </button>
        </div>
      )}

      {/* ── Edit Drawer ─────────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-30 bg-black/25 dark:bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 ${editing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeEdit}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[400px] z-40 bg-white dark:bg-zinc-950 border-l border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${editing ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/40 shrink-0">
          <div className="flex items-center gap-3">
            {editing && <Avatar initials={editing.initials} colorIndex={editing.colorIndex} />}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Edit User</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{editing?.id}</p>
            </div>
          </div>
          <button
            onClick={closeEdit}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Field label="Full Name"     value={draftName}  onChange={setDraftName} />
          <Field label="Email Address" type="email" value={draftEmail} onChange={setDraftEmail} />
          <Field label="Phone Number"  type="tel"   value={draftPhone} onChange={setDraftPhone} />
        </div>

        <div className="px-6 py-4 border-t border-zinc-200/50 dark:border-zinc-800/40 flex justify-end gap-2.5 shrink-0">
          <button
            onClick={closeEdit}
            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Add User Drawer ──────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-30 bg-black/25 dark:bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 ${adding ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeAdd}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[400px] z-40 bg-white dark:bg-zinc-950 border-l border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${adding ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 shrink-0">
              <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Add New User</h3>
          </div>
          <button
            onClick={closeAdd}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Field label="Full Name"     value={addName}  onChange={setAddName} />
          <Field label="Email Address" type="email" value={addEmail} onChange={setAddEmail} />
          <Field label="Phone Number"  type="tel"   value={addPhone} onChange={setAddPhone} />
        </div>

        <div className="px-6 py-4 border-t border-zinc-200/50 dark:border-zinc-800/40 flex justify-end gap-2.5 shrink-0">
          <button
            onClick={closeAdd}
            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveAdd}
            disabled={!addName.trim()}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
          >
            Add User
          </button>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ─────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${deleting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleting(null)}
        />
        <div
          className={`relative w-full max-w-sm bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 transition-all duration-200 ${deleting ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-500/15 flex items-center justify-center mb-4">
            <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">Delete User</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{deleting?.name}</span>?{' '}
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2.5">
            <button
              onClick={() => setDeleting(null)}
              className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
