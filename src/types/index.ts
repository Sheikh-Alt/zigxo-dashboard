export type SessionStatus = 'active' | 'ended';
export type DeviceStatus = 'online' | 'offline';

export interface UserInfo {
  userId: string;
  userName: string;
  phoneNumber: string;
  email: string;
  role: string;
}

export interface TenantInfo {
  tenantId: string;
  tenantName: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  industry: string;
  createdAt: string;
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  channel: string;
  status: DeviceStatus;
}

export interface SessionInfo {
  sessionId: string;
  botName: string;
  instructionSet: string;
  channel: string;
  startedAt: string;
  status: SessionStatus;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
}

export interface BotInfo {
  botId: string;
  botName: string;
  status: 'active' | 'coming-soon';
  colorDot: string;
}

export interface ThingsBoardUserMapping {
  id: string;
  name: string;
  email: string;
  botId: string | null;
  deviceIds: string[];
  telemetryStatus: 'live' | 'offline' | 'none';
}

export interface DeviceTelemetry {
  deviceId: string;
  status: 'online' | 'offline';
  metrics: { label: string; value: string }[];
}

export interface TopicTag {
  id: string;
  name: string;
  description: string;
  icon: string;
  selected?: boolean;
}