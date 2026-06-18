import Card from '../common/Card';
import EditableField from '../common/EditableField';
import ReadOnlyField from '../common/ReadOnlyField';
import type { TenantInfo } from '../../types';
interface Props { tenant: TenantInfo; onUpdate: (field: keyof TenantInfo, value: string) => void; }

export default function TenantInfoSection({ tenant, onUpdate }: Props) {
  return (
    <Card title="Tenant Information">
      <EditableField label="Tenant ID" value={tenant.tenantId} onSave={(v) => onUpdate('tenantId', v)} />
      <ReadOnlyField label="Tenant Name" value={tenant.tenantName} />
      <ReadOnlyField label="Plan" value={tenant.plan} />
      <ReadOnlyField label="Industry" value={tenant.industry} />
    </Card>
  );
}