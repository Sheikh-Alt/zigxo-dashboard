import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import UserInfoSection from '../components/sections/UserInfoSection';
import TenantInfoSection from '../components/sections/TenantInfoSection';
import DeviceInfoSection from '../components/sections/DeviceInfoSection';
import LeadInfoSection from '../components/sections/LeadInfoSection';
import SessionInfoSection from '../components/sections/SessionInfoSection';
import ChatHistorySection from '../components/sections/ChatHistorySection';
import AnalyticsSection from '../components/sections/AnalyticsSection';
import QuickActionsSection from '../components/sections/QuickActionsSection';
import { useDashboardData } from '../hooks/useDashboardData';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Overview');
  const {
    user, tenant, device, lead, session, chatHistory, analytics, quickActions,
    updateUserField, updateTenantField, updateDeviceField, updateLeadStatus, updateSessionField,
  } = useDashboardData();

  const handleQuickAction = (id: string) => alert(`Action triggered: ${id}`);

  const renderContent = () => {
    switch (activePage) {
      case 'Users':
        return <UserInfoSection user={user} onUpdate={updateUserField} />;
      case 'Tenants':
        return <TenantInfoSection tenant={tenant} onUpdate={updateTenantField} />;
      case 'Devices':
        return <DeviceInfoSection device={device} onUpdate={updateDeviceField} />;
      case 'Leads':
        return <LeadInfoSection lead={lead} onStatusChange={updateLeadStatus} />;
      case 'Sessions':
        return <SessionInfoSection session={session} onUpdate={updateSessionField} />;
      case 'Chat Logs':
        return <ChatHistorySection messages={chatHistory} />;
      case 'Analytics':
        return <AnalyticsSection metrics={analytics} />;
      default:
        return (
          <div className="space-y-6">
            <AnalyticsSection metrics={analytics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserInfoSection user={user} onUpdate={updateUserField} />
              <TenantInfoSection tenant={tenant} onUpdate={updateTenantField} />
              <DeviceInfoSection device={device} onUpdate={updateDeviceField} />
              <LeadInfoSection lead={lead} onStatusChange={updateLeadStatus} />
              <SessionInfoSection session={session} onUpdate={updateSessionField} />
              <QuickActionsSection actions={quickActions} onAction={handleQuickAction} />
            </div>
            <ChatHistorySection messages={chatHistory} />
          </div>
        );
    }
  };

  return (
    <DashboardLayout title={activePage} activePage={activePage} onPageChange={setActivePage}>
      {renderContent()}
    </DashboardLayout>
  );
}
