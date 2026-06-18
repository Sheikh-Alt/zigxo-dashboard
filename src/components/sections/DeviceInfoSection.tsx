import Card from '../common/Card';
import EditableField from '../common/EditableField';
import ReadOnlyField from '../common/ReadOnlyField';
import type { DeviceInfo } from '../../types';
interface Props { device: DeviceInfo; onUpdate: (field: keyof DeviceInfo, value: string) => void; }

export default function DeviceInfoSection({ device, onUpdate }: Props) {
  return (
    <Card title="Device Information">
      <EditableField label="Device ID" value={device.deviceId} onSave={(v) => onUpdate('deviceId', v)} />
      <EditableField label="Channel" value={device.channel} onSave={(v) => onUpdate('channel', v)} />
      <ReadOnlyField label="Temperature" value={`${device.temperature} °C`} />
      <ReadOnlyField label="Humidity" value={`${device.humidity}%`} />
      <ReadOnlyField label="Last Alarm" value={device.lastAlarm} />
      <ReadOnlyField label="Last Seen" value={device.lastSeen} />
    </Card>
  );
}