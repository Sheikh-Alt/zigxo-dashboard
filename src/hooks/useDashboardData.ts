import { useState } from 'react';
import type { UserInfo, TenantInfo, DeviceInfo, LeadInfo, SessionInfo, LeadStatus } from '../types';
import {
  mockUser, mockTenant, mockDevice, mockLead, mockSession,
  mockChatHistory, mockAnalytics, mockQuickActions,
} from '../data/mockData';

export function useDashboardData() {
  const [user, setUser] = useState<UserInfo>(mockUser);
  const [tenant, setTenant] = useState<TenantInfo>(mockTenant);
  const [device, setDevice] = useState<DeviceInfo>(mockDevice);
  const [lead, setLead] = useState<LeadInfo>(mockLead);
  const [session, setSession] = useState<SessionInfo>(mockSession);
  const [chatHistory] = useState(mockChatHistory);
  const [analytics] = useState(mockAnalytics);
  const [quickActions] = useState(mockQuickActions);

  const updateUserField = (field: keyof UserInfo, value: string) =>
    setUser((prev) => ({ ...prev, [field]: value }));

  const updateTenantField = (field: keyof TenantInfo, value: string) =>
    setTenant((prev) => ({ ...prev, [field]: value }));

  const updateDeviceField = (field: keyof DeviceInfo, value: string) =>
    setDevice((prev) => ({ ...prev, [field]: value }));

  const updateLeadStatus = (status: LeadStatus) =>
    setLead((prev) => ({ ...prev, leadStatus: status }));

  const updateSessionField = (field: keyof SessionInfo, value: string) =>
    setSession((prev) => ({ ...prev, [field]: value }));

  return {
    user, tenant, device, lead, session, chatHistory, analytics, quickActions,
    updateUserField, updateTenantField, updateDeviceField, updateLeadStatus, updateSessionField,
  };
}