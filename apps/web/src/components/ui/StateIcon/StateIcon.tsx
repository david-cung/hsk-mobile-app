import type { ReactNode } from 'react';

type StateIconName = 'vocabulary' | 'achievements' | 'review' | 'mock-test' | 'error' | 'generic';

type StateIconProps = {
  name: StateIconName;
  className?: string;
};

function IconShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-16 w-16 items-center justify-center rounded-full bg-surface-container shadow-card motion-safe:animate-gentle-float ${className ?? ''}`}
    >
      <svg
        className="h-8 w-8"
        fill="currentColor"
        height="32"
        viewBox="0 0 24 24"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    </div>
  );
}

const stateIconPaths: Record<StateIconName, ReactNode> = {
  vocabulary: (
    <path d="M18 2H6a2 2 0 0 0-2 2v16l8-3 8 3V4a2 2 0 0 0-2-2Zm0 15.17-6-2.25-6 2.25V4h12v13.17Z" />
  ),
  achievements: (
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2ZM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8Zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1Z" />
  ),
  review: (
    <path d="M12 6v3l4.25 2.52-.77 1.28L12 10.33V18h2v2H6v-2h2v-7.67l-3.48 2.07-.77-1.28L9 9V6c0-1.66 1.34-3 3-3s3 1.34 3 3Z" />
  ),
  'mock-test': (
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-7 14-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6Z" />
  ),
  error: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
  ),
  generic: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />,
};

const stateIconColors: Record<StateIconName, string> = {
  vocabulary: 'text-tertiary',
  achievements: 'text-secondary',
  review: 'text-primary',
  'mock-test': 'text-primary',
  error: 'text-error',
  generic: 'text-on-surface-variant',
};

export function StateIcon({ name, className }: StateIconProps) {
  return (
    <IconShell className={`${stateIconColors[name]} ${className ?? ''}`}>
      {stateIconPaths[name]}
    </IconShell>
  );
}

export type { StateIconName, StateIconProps };
