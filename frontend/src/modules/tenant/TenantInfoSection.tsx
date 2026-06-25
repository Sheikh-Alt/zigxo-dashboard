import Card from '../../components/common/Card';
import EditableField from '../../components/common/EditableField';
import ReadOnlyField from '../../components/common/ReadOnlyField';
import type { TenantInfo } from '../../types';

interface Props { tenant: TenantInfo; onUpdate: (field: keyof TenantInfo, value: string) => void; }

export default function TenantInfoSection({ tenant, onUpdate }: Props) {
  return (
    <Card title="Tenant Information">
      <EditableField
        label="Tenant ID"
        value={tenant.tenantId}
        onSave={(v) => onUpdate('tenantId', v)}
        onDelete={() => onUpdate('tenantId', '')}
      />
      <ReadOnlyField label="Tenant Name" value={tenant.tenantName} />
      <ReadOnlyField label="Industry" value={tenant.industry} />
    </Card>
  );
}
