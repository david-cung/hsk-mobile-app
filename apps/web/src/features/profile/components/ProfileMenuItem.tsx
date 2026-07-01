import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/utils';

type ProfileMenuItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
};

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-outline-variant"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.4 18 15.4 12 9.4 6 8 7.4l5.6 5.6-5.6 5.6L9.4 18Z" fill="currentColor" />
    </svg>
  );
}

export function ProfileMenuItem({ href, icon, label }: ProfileMenuItemProps) {
  return (
    <li>
      <Link
        className={cn(
          'flex min-h-11 items-center justify-between gap-stack-md px-card-padding py-stack-md',
          'text-on-surface no-underline transition-colors hover:bg-surface-container-low',
          'ring-focus focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset',
        )}
        to={href}
      >
        <span className="flex min-w-0 items-center gap-stack-md">
          <span aria-hidden="true" className="shrink-0 text-on-surface-variant">
            {icon}
          </span>
          <span className="text-body-md">{label}</span>
        </span>
        <ChevronRightIcon />
      </Link>
    </li>
  );
}

export type { ProfileMenuItemProps };
