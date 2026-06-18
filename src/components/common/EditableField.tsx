import { useState } from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
}

export default function EditableField({ label, value, onSave }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => { onSave(draft); setEditing(false); };
  const handleCancel = () => { setDraft(value); setEditing(false); };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button onClick={handleSave} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Save</button>
          <button onClick={handleCancel} className="text-xs font-medium text-gray-400 hover:text-gray-600">Cancel</button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900">{value}</span>
          <button onClick={() => setEditing(true)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
        </div>
      )}
    </div>
  );
}