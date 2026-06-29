import Card from '../../components/common/Card';
import EditableField from '../../components/common/EditableField';
import ReadOnlyField from '../../components/common/ReadOnlyField';
import Badge from '../../components/common/Badge';
import type { SessionInfo } from '../../types';

interface Props { session: SessionInfo; onUpdate: (field: keyof SessionInfo, value: string) => void; }

export default function SessionInfoSection({ session, onUpdate }: Props) {
  return (
    <Card title="Session Information">
      <div className="py-3 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Status</p>
        <Badge label={session.status === 'active' ? 'Active' : 'Ended'} color={session.status === 'active' ? 'green' : 'gray'} />
      </div>
      <EditableField label="Bot Name" value={session.botName} onSave={(v) => onUpdate('botName', v)} />
      <EditableField label="Instruction Set" value={session.instructionSet} onSave={(v) => onUpdate('instructionSet', v)} />
      <ReadOnlyField label="Channel" value={session.channel} />
      <ReadOnlyField label="Started At" value={session.startedAt} />
    </Card>
  );
}
