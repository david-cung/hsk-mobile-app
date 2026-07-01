import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import type { DashboardTabPath } from '@/app/router/types';
import { cn } from '@/utils';

type TabItemProps = {
  to: DashboardTabPath;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

export function TabItem({ to, label, icon, end = false }: TabItemProps) {
  return (
    <li className="flex flex-1">
      <NavLink
        className={({ isActive }) =>
          cn(
            'flex min-h-11 w-full flex-col items-center justify-center gap-1 rounded-md px-2 py-2 no-underline transition-colors',
            'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
            isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface',
          )
        }
        end={end}
        to={to}
      >
        {({ isActive }) => (
          <>
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center">
              {icon}
            </span>
            <span className={cn('text-label-sm', isActive && 'font-semibold')}>{label}</span>
            <span
              aria-hidden="true"
              className={cn(
                'h-1 w-1 rounded-full bg-primary transition-opacity',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            />
          </>
        )}
      </NavLink>
    </li>
  );
}
