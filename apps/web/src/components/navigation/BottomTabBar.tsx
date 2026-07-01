import type { ReactElement } from 'react';

import type { DashboardTabPath } from '@/app/router/types';

import { TabItem } from './TabItem';

type TabConfig = {
  to: DashboardTabPath;
  label: string;
  end?: boolean;
  icon: ReactElement;
};

function HomeIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function LearnIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v13A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5v-13Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 7h8M8 11h8M8 15h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function PracticeIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.5 18.5 10 9l3.5 4.5L17 8l2.5 10.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path d="M4 19.5h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 18V8m4 10V5m4 13v-7m4 7V11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
      <path d="M4 19h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M6.5 19c1.2-2.5 3.2-3.75 5.5-3.75S16.3 16.5 17.5 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

const TABS: TabConfig[] = [
  { to: '/', label: 'Home', end: true, icon: <HomeIcon /> },
  { to: '/learn', label: 'Learn', icon: <LearnIcon /> },
  { to: '/practice', label: 'Practice', icon: <PracticeIcon /> },
  { to: '/progress', label: 'Progress', icon: <ProgressIcon /> },
  { to: '/profile', label: 'Profile', icon: <ProfileIcon /> },
];

export function BottomTabBar() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex h-[60px] items-stretch justify-around px-gutter-mobile">
        {TABS.map((tab) => (
          <TabItem end={tab.end} icon={tab.icon} key={tab.to} label={tab.label} to={tab.to} />
        ))}
      </ul>
    </nav>
  );
}
