import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import OverviewSection from '../modules/overview/OverviewSection';
import UserInfoSection from '../modules/user/UserInfoSection';
import TenantsSection from '../modules/tenants/TenantsSection';
import SessionsListSection from '../modules/session/SessionsListSection';
import ChatHistorySection from '../modules/chat/ChatHistorySection';
import AnalyticsSection from '../modules/analytics/AnalyticsSection';
import QuickActionsSection from '../modules/quick-actions/QuickActionsSection';
import ThingsBoardSection from '../modules/thingsboard/ThingsBoardSection';
import TopicsSection from '../modules/topics/TopicsSection';
import UsersManagementSection from '../modules/usersManagement/UsersManagementSection';
import { useDashboardData } from '../hooks/useDashboardData';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('Overview');

  const {
    user, analytics, quickActions,
    overviewKPIs, alerts, recentTenants, recentUsers,
    updateUserField,
  } = useDashboardData();

  const handleQuickAction = (id: string) => alert(`Action triggered: ${id}`);

  const renderContent = () => {
    switch (activePage) {
      case 'Overview':
        return (
          <OverviewSection
            kpis={overviewKPIs}
            alerts={alerts}
            recentTenants={recentTenants}
            recentUsers={recentUsers}
            onViewAllTenants={() => setActivePage('Tenants')}
            onViewAllUsers={() => setActivePage('Users')}
          />
        );
      case 'Analytics':
        return <AnalyticsSection metrics={analytics} />;
      case 'Tenants':
        return <TenantsSection />;
      case 'Agents':
        return <TopicsSection />;
      case 'ThingsBoard':
        return <ThingsBoardSection />;
      case 'Sessions':
        return <SessionsListSection />;
      case 'Users':
        return <UsersManagementSection />;
      case 'Chat Logs':
        return <ChatHistorySection />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserInfoSection user={user} onUpdate={updateUserField} />
              <QuickActionsSection actions={quickActions} onAction={handleQuickAction} />
            </div>
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
