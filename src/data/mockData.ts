import type {
  UserInfo, TenantInfo, DeviceInfo, LeadInfo, SessionInfo,
  ChatMessage, AnalyticsMetric, QuickAction,
} from '../types';

export const mockUser: UserInfo = {
  userId: 'USR-1001',
  userName: 'Ananya Sharma',
  phoneNumber: '+91 98765 43210',
  email: 'ananya.sharma@example.com',
  role: 'Account Owner',
};

export const mockTenant: TenantInfo = {
  tenantId: 'TEN-7841',
  tenantName: 'Zigxo Retail Pvt Ltd',
  plan: 'Pro',
  industry: 'Retail & E-commerce',
  createdAt: '2024-11-12',
};

export const mockDevice: DeviceInfo = {
  deviceId: 'DEV-3392',
  deviceName: 'Zigxo Sensor Hub A1',
  channel: 'WhatsApp',
  temperature: 24.6,
  humidity: 58,
  lastAlarm: '2026-06-15 14:32',
  lastSeen: '2026-06-17 09:12',
  status: 'online',
};

export const mockLead: LeadInfo = {
  leadId: 'LEAD-5521',
  leadName: 'Rohit Verma',
  leadStatus: 'Qualified',
  source: 'Website Chatbot',
  email: 'rohit.verma@example.com',
  phone: '+91 91234 56789',
  createdAt: '2026-06-10',
};

export const mockSession: SessionInfo = {
  sessionId: 'SES-9087',
  botName: 'Zigxo Assistant',
  instructionSet: 'Friendly, concise support agent for order tracking and returns.',
  channel: 'WhatsApp',
  startedAt: '2026-06-17 09:05',
  status: 'active',
};

export const mockChatHistory: ChatMessage[] = [
  { id: 'c1', sender: 'user', message: 'Hi, I want to check my order status.', timestamp: '09:05 AM' },
  { id: 'c2', sender: 'bot', message: 'Sure! Could you share your order ID?', timestamp: '09:05 AM' },
  { id: 'c3', sender: 'user', message: 'ORD-44231', timestamp: '09:06 AM' },
  { id: 'c4', sender: 'bot', message: 'Your order is out for delivery and should arrive today by 6 PM.', timestamp: '09:06 AM' },
  { id: 'c5', sender: 'user', message: 'Great, thank you!', timestamp: '09:07 AM' },
];

export const mockAnalytics: AnalyticsMetric[] = [
  { id: 'a1', label: 'Total Conversations', value: '1,284', change: 12.4, trend: 'up' },
  { id: 'a2', label: 'Active Sessions', value: '37', change: 4.1, trend: 'up' },
  { id: 'a3', label: 'Avg Response Time', value: '1.8s', change: 8.2, trend: 'down' },
  { id: 'a4', label: 'Leads Converted', value: '152', change: 6.7, trend: 'up' },
];

export const mockQuickActions: QuickAction[] = [
  { id: 'q1', label: 'Restart Session', description: 'Force-restart the active bot session' },
  { id: 'q2', label: 'Send Test Message', description: 'Trigger a test message on this channel' },
  { id: 'q3', label: 'Export Chat Log', description: 'Download this conversation as a file' },
  { id: 'q4', label: 'Flag for Review', description: 'Mark this session for QA review' },
];