import { useState } from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  onDelete?: () => void;
}

export default function EditableField({ label, value, onSave, onDelete }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => { onSave(draft); setEditing(false); };
  const handleCancel = () => { setDraft(value); setEditing(false); };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete?.();
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="group border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all duration-150 -mx-2 px-2">
      {editing ? (
        <div className="py-3">
          <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">{label}</p>
          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md px-2.5 py-1.5 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-150"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-150 px-2 py-1.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors duration-150 px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700/60"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between py-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {value || <span className="text-zinc-400 italic">—</span>}
            </p>
          </div>

          <div className="flex items-center gap-0.5 ml-3 shrink-0">
            <button
              onClick={() => { setEditing(true); setConfirmDelete(false); }}
              title="Edit"
              className="w-11 h-11 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-150 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            {onDelete && (
              confirmDelete ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-rose-500 dark:text-rose-400 font-medium">Delete?</span>
                  <button
                    onClick={handleDelete}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 transition-colors duration-150 px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors duration-150 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700/60"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDelete}
                  title="Delete"
                  className="w-11 h-11 flex items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-150 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" /><path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
