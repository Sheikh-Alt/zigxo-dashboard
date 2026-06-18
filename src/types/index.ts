export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
export type SessionStatus = 'active' | 'ended';
export type DeviceStatus = 'online' | 'offline';

export interface UserInfo {
  userId: string;
  userName: string;       // editable
  phoneNumber: string;    // editable
  email: string;
  role: string;
}

export interface TenantInfo {
  tenantId: string;       // editable
  tenantName: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  industry: string;
  createdAt: string;
}

export interface DeviceInfo {
  deviceId: string;       // editable
  deviceName: string;
  channel: string;        // editable
  temperature: number;    // read-only
  humidity: number;       // read-only
  lastAlarm: string;      // read-only
  lastSeen: string;       // read-only
  status: DeviceStatus;
}

export interface LeadInfo {
  leadId: string;
  leadName: string;
  leadStatus: LeadStatus; // editable
  source: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface SessionInfo {
  sessionId: string;
  botName: string;          // editable
  instructionSet: string;   // editable
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