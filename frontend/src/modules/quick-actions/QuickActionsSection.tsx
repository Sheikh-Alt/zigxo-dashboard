import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import type { QuickAction } from '../../types';

const ACTION_BUTTON_LABELS: Record<string, string> = {
  q1: 'Restart Bot',
  q2: 'Send Test Message',
  q3: 'Export Chat Log',
  q4: 'Flag for Review',
};

interface Props { actions: QuickAction[]; onAction: (id: string) => void; }

export default function QuickActionsSection({ actions, onAction }: Props) {
  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((a) => (
          <div
            key={a.id}
            className="border-[0.5px] border-zinc-200/70 dark:border-zinc-700/50 rounded-xl p-4 flex flex-col gap-3 hover:border-indigo-200 dark:hover:border-indigo-700/60 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5 hover:shadow-sm transition-all duration-150"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{a.label}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{a.description}</p>
            </div>
            <Button
              variant="primary"
              onClick={() => onAction(a.id)}
              className="self-start text-xs px-3 py-1.5"
            >
              {ACTION_BUTTON_LABELS[a.id] ?? a.label}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
