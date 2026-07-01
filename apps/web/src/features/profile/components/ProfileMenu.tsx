import type { ReactNode } from 'react';

import { Card } from '@/components/ui/Card';

import { ProfileMenuItem } from './ProfileMenuItem';

export type ProfileMenuItemId =
  'achievements' | 'daily-review' | 'mock-tests' | 'saved-words' | 'settings';

export type ProfileMenuItemConfig = {
  href: `/profile/${ProfileMenuItemId}` | '/settings';
  icon: ReactNode;
  id: ProfileMenuItemId;
  label: string;
};

function MenuIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

const PROFILE_MENU_ITEMS: ProfileMenuItemConfig[] = [
  {
    id: 'daily-review',
    label: 'Daily Review',
    href: '/profile/daily-review',
    icon: (
      <MenuIcon>
        <path
          d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 11h4v-2h-3V7h-2v6Z"
          fill="currentColor"
        />
      </MenuIcon>
    ),
  },
  {
    id: 'saved-words',
    label: 'Saved Words',
    href: '/profile/saved-words',
    icon: (
      <MenuIcon>
        <path
          d="M18 2H6a2 2 0 0 0-2 2v16l8-3 8 3V4a2 2 0 0 0-2-2Zm0 15.17-6-2.25-6 2.25V4h12v13.17Z"
          fill="currentColor"
        />
      </MenuIcon>
    ),
  },
  {
    id: 'achievements',
    label: 'Achievements',
    href: '/profile/achievements',
    icon: (
      <MenuIcon>
        <path
          d="m12 2 2.4 4.86 5.37.78-3.89 3.79.92 5.35L12 14.77l-4.8 2.52.92-5.35L4.23 7.64l5.37-.78L12 2Z"
          fill="currentColor"
        />
      </MenuIcon>
    ),
  },
  {
    id: 'mock-tests',
    label: 'Mock Tests',
    href: '/profile/mock-tests',
    icon: (
      <MenuIcon>
        <path d="M4 6h16v12H4V6Zm2 2v8h12V8H6Zm2 2h8v2H8v-2Zm0 3h5v2H8v-2Z" fill="currentColor" />
      </MenuIcon>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: (
      <MenuIcon>
        <path
          d="M19.14 12.94a7.43 7.43 0 0 0 .05-.94 7.43 7.43 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.28 7.28 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.36 2.54a7.28 7.28 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.6 8.44a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94s.02.63.05.94L2.72 13.5a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.39 1.05.7 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h4a.5.5 0 0 0 .5-.42l.36-2.54c.58-.24 1.13-.55 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
          fill="currentColor"
        />
      </MenuIcon>
    ),
  },
];

type ProfileMenuProps = {
  items?: ProfileMenuItemConfig[];
};

export function ProfileMenu({ items = PROFILE_MENU_ITEMS }: ProfileMenuProps) {
  return (
    <nav aria-labelledby="profile-menu-heading">
      <h2 className="sr-only" id="profile-menu-heading">
        Profile menu
      </h2>
      <Card className="overflow-hidden p-0">
        <ul className="m-0 list-none divide-y divide-surface-container-high p-0">
          {items.map((item) => (
            <ProfileMenuItem href={item.href} icon={item.icon} key={item.id} label={item.label} />
          ))}
        </ul>
      </Card>
    </nav>
  );
}

export type { ProfileMenuProps };
