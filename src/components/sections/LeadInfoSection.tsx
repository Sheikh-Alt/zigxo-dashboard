import Card from '../common/Card';
import ReadOnlyField from '../common/ReadOnlyField';
import Badge from '../common/Badge';
import type { LeadInfo, LeadStatus } from '../../types';
interface Props { lead: LeadInfo; onStatusChange: (status: LeadStatus) => void; }

const statusOptions: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const statusColor: Record<LeadStatus, 'green' | 'blue' | 'yellow' | 'red' | 'gray'> = {
  New: 'blue', Contacted: 'yellow', Qualified: 'green', Converted: 'green', Lost: 'red',
};

export default function LeadInfoSection({ lead, onStatusChange }: Props) {
  return (
    <Card title="CRM / Lead Information">
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500">Lead Status</span>
        <div className="flex items-center gap-2">
          <Badge label={lead.leadStatus} color={statusColor[lead.leadStatus]} />
          <select
            value={lead.leadStatus}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
            className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <ReadOnlyField label="Lead Name" value={lead.leadName} />
      <ReadOnlyField label="Source" value={lead.source} />
      <ReadOnlyField label="Email" value={lead.email} />
      <ReadOnlyField label="Phone" value={lead.phone} />
    </Card>
  );
}