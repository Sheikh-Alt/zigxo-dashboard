import Card from '../common/Card';
import Button from '../common/Button';
import type { QuickAction } from '../../types';
interface Props { actions: QuickAction[]; onAction: (id: string) => void; }

export default function QuickActionsSection({ actions, onAction }: Props) {
  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((a) => (
          <div key={a.id} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
            <div>
              <p className="text-sm font-medium text-gray-900">{a.label}</p>
              <p className="text-xs text-gray-500">{a.description}</p>
            </div>
            <Button variant="secondary" onClick={() => onAction(a.id)} className="self-start">Run</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}