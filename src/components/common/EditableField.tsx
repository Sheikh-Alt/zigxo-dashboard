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
    <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-md px-2 py-1 w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button onClick={handleSave} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">Save</button>
          <button onClick={handleCancel} className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">Cancel</button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mr-2">{value || <span className="text-zinc-400 italic">—</span>}</span>

          {/* Edit icon */}
          <button
            onClick={() => { setEditing(true); setConfirmDelete(false); }}
            title="Edit"
            className="p-1.5 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* Delete icon — only shown when onDelete is provided */}
          {onDelete && (
            confirmDelete ? (
              <div className="flex items-center gap-1.5 ml-1">
                <span className="text-xs text-rose-500 dark:text-rose-400">Confirm?</span>
                <button
                  onClick={handleDelete}
                  className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={handleDelete}
                title="Delete"
                className="p-1.5 rounded-md text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" /><path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}