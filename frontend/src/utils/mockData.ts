import type {
  UserInfo, TenantInfo, DeviceInfo, SessionInfo,
  ChatMessage, AnalyticsMetric, QuickAction,
  BotInfo, ThingsBoardUserMapping, DeviceTelemetry, TopicTag,
  OverviewKPI, AlertItem, RecentTenantRow, RecentUserRow,
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
  description: 'AI-powered retail & e-commerce operations platform',
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
  { botId: 'TB-001', botName: 'Thingsboard Bot', status: 'active', colorDot: 'bg-indigo-500' },
  { botId: 'BDA-001', botName: 'BDA Sales Bot', status: 'active', colorDot: 'bg-purple-500' },
];

export const mockThingsBoardUsers: ThingsBoardUserMapping[] = [
  { id: 'u1', name: 'Alice Chen', email: 'alice@zigxo.io', botId: 'TB-001', deviceIds: ['DEV-1001', 'DEV-1002'], telemetryStatus: 'live' },
  { id: 'u2', name: 'Ravi Kumar', email: 'ravi@zigxo.io', botId: 'TB-001', deviceIds: ['DEV-1003'], telemetryStatus: 'live' },
  { id: 'u3', name: 'Sara Müller', email: 'sara@zigxo.io', botId: 'BDA-001', deviceIds: ['DEV-1004', 'DEV-1005'], telemetryStatus: 'live' },
  { id: 'u4', name: 'James Obi', email: 'james@zigxo.io', botId: 'BDA-001', deviceIds: ['DEV-1006'], telemetryStatus: 'offline' },
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

export const mockOverviewKPIs: OverviewKPI[] = [
  { id: 'k1', label: 'Total Tenants', value: '48', icon: 'Building2', delta: '+3 this week', status: 'good' },
  { id: 'k2', label: 'Active Users', value: '1,284', icon: 'Users', delta: '+87 this month', status: 'good' },
  { id: 'k3', label: 'System Health', value: '99.2%', icon: 'Activity', delta: 'All systems nominal', status: 'good' },
  { id: 'k4', label: 'Active Sessions', value: '37', icon: 'Zap', delta: '+4 from yesterday', status: 'good' },
];

export const mockAlerts: AlertItem[] = [
  { id: 'al2', severity: 'critical', message: 'API response time spike — avg 4.2s (threshold: 2s).', timestamp: '25 min ago' },
  { id: 'al3', severity: 'info', message: '1 IoT device (DEV-1006) has gone offline.', timestamp: '1 hr ago' },
];

export const mockRecentTenants: RecentTenantRow[] = [
  { tenantId: 'TEN-7841', tenantName: 'Zigxo Retail Pvt Ltd', plan: 'Pro', createdAt: '2024-11-12', status: 'active' },
  { tenantId: 'TEN-7842', tenantName: 'GreenField Logistics', plan: 'Enterprise', createdAt: '2024-12-01', status: 'active' },
  { tenantId: 'TEN-7843', tenantName: 'Urban Eats Co.', plan: 'Free', createdAt: '2025-01-15', status: 'active' },
  { tenantId: 'TEN-7844', tenantName: 'NextWave Tech', plan: 'Pro', createdAt: '2025-03-08', status: 'suspended' },
  { tenantId: 'TEN-7845', tenantName: 'Solaris Health', plan: 'Enterprise', createdAt: '2025-05-20', status: 'active' },
];

export const mockRecentUsers: RecentUserRow[] = [
  { userId: 'USR-1001', userName: 'Ananya Sharma', email: 'ananya.sharma@example.com', role: 'Account Owner', lastActive: '2 min ago' },
  { userId: 'USR-1002', userName: 'Raj Patel', email: 'raj.patel@example.com', role: 'Admin', lastActive: '15 min ago' },
  { userId: 'USR-1003', userName: 'Emily Zhang', email: 'emily.zhang@example.com', role: 'Viewer', lastActive: '1 hr ago' },
  { userId: 'USR-1004', userName: 'Carlos Mendez', email: 'carlos.m@example.com', role: 'Admin', lastActive: '3 hrs ago' },
  { userId: 'USR-1005', userName: 'Fatima Al-Sayed', email: 'fatima.as@example.com', role: 'Viewer', lastActive: 'Yesterday' },
];
