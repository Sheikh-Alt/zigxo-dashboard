import Card from '../../components/common/Card';
import EditableField from '../../components/common/EditableField';
import ReadOnlyField from '../../components/common/ReadOnlyField';
import type { UserInfo } from '../../types';

interface Props { user: UserInfo; onUpdate: (field: keyof UserInfo, value: string) => void; }

export default function UserInfoSection({ user, onUpdate }: Props) {
  return (
    <Card title="User Information">
      <EditableField label="User Name" value={user.userName} onSave={(v) => onUpdate('userName', v)} />
      <EditableField label="Phone Number" value={user.phoneNumber} onSave={(v) => onUpdate('phoneNumber', v)} />
      <ReadOnlyField label="Email" value={user.email} />
      <ReadOnlyField label="Role" value={user.role} />
    </Card>
  );
}
