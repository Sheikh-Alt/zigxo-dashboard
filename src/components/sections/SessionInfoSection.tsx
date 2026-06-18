import Card from '../common/Card';
import EditableField from '../common/EditableField';
import ReadOnlyField from '../common/ReadOnlyField';
import Badge from '../common/Badge';
import type { SessionInfo } from '../../types';
interface Props { session: SessionInfo; onUpdate: (field: keyof SessionInfo, value: string) => void; }

export default function SessionInfoSection({ session, onUpdate }: Props) {
  return (
    <Card title="Session Information">
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500">Status</span>
        <Badge label={session.status === 'active' ? 'Active' : 'Ended'} color={session.status === 'active' ? 'green' : 'gray'} />
      </div>
      <EditableField label="Bot Name" value={session.botName} onSave={(v) => onUpdate('botName', v)} />
      <EditableField label="Instruction Set" value={session.instructionSet} onSave={(v) => onUpdate('instructionSet', v)} />
      <ReadOnlyField label="Channel" value={session.channel} />
      <ReadOnlyField label="Started At" value={session.startedAt} />
    </Card>
  );
}