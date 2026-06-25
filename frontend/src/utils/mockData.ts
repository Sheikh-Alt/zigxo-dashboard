import type {
  UserInfo, TenantInfo, DeviceInfo, SessionInfo,
  ChatMessage, AnalyticsMetric, QuickAction,
  BotInfo, ThingsBoardUserMapping, DeviceTelemetry, TopicTag,
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
  status: 'online',
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
  { id: 'a4', label: 'Deals Closed', value: '152', change: 6.7, trend: 'up' },
];

export const mockQuickActions: QuickAction[] = [
  { id: 'q1', label: 'Restart Session', description: 'Force-restart the active bot session' },
  { id: 'q2', label: 'Send Test Message', description: 'Trigger a test message on this channel' },
  { id: 'q3', label: 'Export Chat Log', description: 'Download this conversation as a file' },
  { id: 'q4', label: 'Flag for Review', description: 'Mark this session for QA review' },
];

export const mockBots: BotInfo[] = [
  { botId: 'CGB-001', botName: 'City Greens Bot', status: 'active', colorDot: 'bg-indigo-500' },
  { botId: 'BOT-002', botName: 'Bot 2 (Coming Soon)', status: 'coming-soon', colorDot: 'bg-zinc-300 dark:bg-zinc-700' },
];

export const mockThingsBoardUsers: ThingsBoardUserMapping[] = [
  { id: 'u1', name: 'Alice Chen', email: 'alice@zigxo.io', botId: 'CGB-001', deviceIds: ['DEV-1001', 'DEV-1002'], telemetryStatus: 'live' },
  { id: 'u2', name: 'Ravi Kumar', email: 'ravi@zigxo.io', botId: 'CGB-001', deviceIds: ['DEV-1003'], telemetryStatus: 'live' },
  { id: 'u3', name: 'Sara Müller', email: 'sara@zigxo.io', botId: 'CGB-001', deviceIds: ['DEV-1004', 'DEV-1005'], telemetryStatus: 'live' },
  { id: 'u4', name: 'James Obi', email: 'james@zigxo.io', botId: 'CGB-001', deviceIds: ['DEV-1006'], telemetryStatus: 'offline' },
  { id: 'u5', name: 'Priya Nair', email: 'priya@zigxo.io', botId: null, deviceIds: [], telemetryStatus: 'none' },
];

export const mockDeviceTelemetry: Record<string, DeviceTelemetry> = {
  'DEV-1001': { deviceId: 'DEV-1001', status: 'online', metrics: [{ label: 'Temperature', value: '24.3 °C' }, { label: 'Battery', value: '87%' }, { label: 'Uptime', value: '14d 6h' }] },
  'DEV-1002': { deviceId: 'DEV-1002', status: 'online', metrics: [{ label: 'Humidity', value: '62%' }, { label: 'Dew Point', value: '16.1 °C' }, { label: 'Uptime', value: '7d 2h' }] },
  'DEV-1003': { deviceId: 'DEV-1003', status: 'online', metrics: [{ label: 'Motion Events', value: '12 today' }, { label: 'Battery', value: '74%' }, { label: 'Uptime', value: '21d 4h' }] },
  'DEV-1004': { deviceId: 'DEV-1004', status: 'online', metrics: [{ label: 'Temperature', value: '23.1 °C' }, { label: 'Battery', value: '91%' }, { label: 'Uptime', value: '30d 1h' }] },
  'DEV-1005': { deviceId: 'DEV-1005', status: 'online', metrics: [{ label: 'Pressure', value: '1013 hPa' }, { label: 'Battery', value: '68%' }, { label: 'Uptime', value: '5d 9h' }] },
  'DEV-1006': { deviceId: 'DEV-1006', status: 'offline', metrics: [{ label: 'Air Quality', value: 'No data' }] },
};

export const mockTopics: TopicTag[] = [
  { id: 't1', name: 'BDA / Sales', description: 'Leads, targets, revenue', icon: '📈', selected: true },
  { id: 't2', name: 'ThingsBoard', description: 'IoT, devices, sensors', icon: '🧩', selected: false },
];
