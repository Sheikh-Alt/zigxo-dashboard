import { useState } from 'react';
import EditableField from '../../components/common/EditableField';
import ReadOnlyField from '../../components/common/ReadOnlyField';
import type { TenantInfo } from '../../types';

interface Props {
  tenant: TenantInfo;
  onUpdate: (field: keyof TenantInfo, value: string) => void;
  onDelete?: () => void;
}

export default function TenantInfoSection({ tenant, onUpdate, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete?.();
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="group/card bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm p-6 transition-all duration-150 hover:shadow-md hover:border-zinc-300/60 dark:hover:border-zinc-700/60">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Tenant Information
        </h3>

        {onDelete && (
          <div className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-150 flex items-center gap-1.5">
            {confirmDelete ? (
              <>
                <span className="text-xs text-rose-500 dark:text-rose-400 font-medium">Delete tenant?</span>
                <button
                  onClick={handleDelete}
                  className="text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 px-2.5 py-1 rounded-md transition-colors duration-150"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors duration-150"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleDelete}
                title="Delete tenant"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" /><path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Delete tenant
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fields */}
      <ReadOnlyField label="Tenant ID" value={tenant.tenantId} />
      <ReadOnlyField label="Tenant Name" value={tenant.tenantName} />
      <EditableField
        label="Description"
        value={tenant.description}
        onSave={(v) => onUpdate('description', v)}
      />
    </div>
  );
}
