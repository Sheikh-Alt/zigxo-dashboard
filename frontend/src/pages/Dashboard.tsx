import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import UserInfoSection from '../modules/user/UserInfoSection';
import TenantInfoSection from '../modules/tenant/TenantInfoSection';
import SessionInfoSection from '../modules/session/SessionInfoSection';
import ChatHistorySection from '../modules/chat/ChatHistorySection';
import AnalyticsSection from '../modules/analytics/AnalyticsSection';
import QuickActionsSection from '../modules/quick-actions/QuickActionsSection';
import ThingsBoardSection from '../modules/thingsboard/ThingsBoardSection';
import TopicsSection from '../modules/topics/TopicsSection';
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
