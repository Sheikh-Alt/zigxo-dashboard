import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import UserInfoSection from '../components/sections/UserInfoSection';
import TenantInfoSection from '../components/sections/TenantInfoSection';
import SessionInfoSection from '../components/sections/SessionInfoSection';
import ChatHistorySection from '../components/sections/ChatHistorySection';
import AnalyticsSection from '../components/sections/AnalyticsSection';
import QuickActionsSection from '../components/sections/QuickActionsSection';
import ThingsBoardSection from '../components/sections/ThingsBoardSection';
import TopicsSection from '../components/sections/TopicsSection';
import { useDashboardData } from '../hooks/useDashboardData';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Overview');

  const {
    user, tenant, session, chatHistory, analytics, quickActions,
    updateUserField, updateTenantField, updateSessionField,
  } = useDashboardData();

  const handleQuickAction = (id: string) => alert(`Action triggered: ${id}`);

  const renderContent = () => {
    switch (activePage) {
      case 'Analytics':
        return <AnalyticsSection metrics={analytics} />;
      case 'Tenants':
        return <TenantInfoSection tenant={tenant} onUpdate={updateTenantField} />;
      case 'Agents':
        return <TopicsSection />;
      case 'ThingsBoard':
        return <ThingsBoardSection />;
      case 'Sessions':
        return <SessionInfoSection session={session} onUpdate={updateSessionField} />;
      case 'Chat Logs':
        return <ChatHistorySection messages={chatHistory} />;
      default:
        return (
          <div className="space-y-6">
            <AnalyticsSection metrics={analytics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserInfoSection user={user} onUpdate={updateUserField} />
              <TenantInfoSection tenant={tenant} onUpdate={updateTenantField} />
              <SessionInfoSection session={session} onUpdate={updateSessionField} />
              <QuickActionsSection actions={quickActions} onAction={handleQuickAction} />
            </div>
            <ChatHistorySection messages={chatHistory} />
          </div>
        );
    }
  };

  return (
    <DashboardLayout activePage={activePage} onPageChange={setActivePage}>
      {renderContent()}
    </DashboardLayout>
  );
}