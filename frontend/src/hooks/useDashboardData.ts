import { useState } from 'react';
import type { UserInfo, TenantInfo, DeviceInfo, SessionInfo } from '../types';
import {
  mockUser, mockTenant, mockDevice, mockSession,
  mockChatHistory, mockAnalytics, mockQuickActions,
  mockOverviewKPIs, mockAlerts, mockRecentTenants, mockRecentUsers,
} from '../utils/mockData';

export function useDashboardData() {
  const [user, setUser] = useState<UserInfo>(mockUser);
  const [tenant, setTenant] = useState<TenantInfo>(mockTenant);
  const [device, setDevice] = useState<DeviceInfo>(mockDevice);
  const [session, setSession] = useState<SessionInfo>(mockSession);
  const [chatHistory] = useState(mockChatHistory);
  const [analytics] = useState(mockAnalytics);
  const [quickActions] = useState(mockQuickActions);
  const [overviewKPIs] = useState(mockOverviewKPIs);
  const [alerts] = useState(mockAlerts);
  const [recentTenants] = useState(mockRecentTenants);
  const [recentUsers] = useState(mockRecentUsers);

  const updateUserField = (field: keyof UserInfo, value: string) =>
    setUser((prev) => ({ ...prev, [field]: value }));

  const updateTenantField = (field: keyof TenantInfo, value: string) =>
    setTenant((prev) => ({ ...prev, [field]: value }));

  const deleteTenant = () =>
    setTenant({ tenantId: '', tenantName: '', plan: 'Free', description: '', createdAt: '' });

  const updateDeviceField = (field: keyof DeviceInfo, value: string) =>
    setDevice((prev) => ({ ...prev, [field]: value }));

  const updateSessionField = (field: keyof SessionInfo, value: string) =>
    setSession((prev) => ({ ...prev, [field]: value }));

  return {
    user, tenant, device, session, chatHistory, analytics, quickActions,
    overviewKPIs, alerts, recentTenants, recentUsers,
    updateUserField, updateTenantField, deleteTenant, updateDeviceField, updateSessionField,
  };
}
