import { Outlet } from 'react-router-dom';

import { BottomTabBar } from '@/components/navigation/BottomTabBar';

const TAB_BAR_HEIGHT = 'calc(60px + env(safe-area-inset-bottom, 0px))';

export function DashboardLayout() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <div className="flex-1" style={{ paddingBottom: TAB_BAR_HEIGHT }}>
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  );
}
