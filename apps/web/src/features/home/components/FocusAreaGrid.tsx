import type { ReactNode } from 'react';

import { cn } from '@/utils';

type FocusArea = {
  id: string;
  label: string;
  icon: ReactNode;
};

const FOCUS_AREAS: FocusArea[] = [
  {
    id: 'vocabulary',
    label: 'Vocabulary',
    icon: (
      <path
        d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H18V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04ZM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12Zm-2.62 7 1.62-4.33L19.12 17h-3.24Z"
        fill="currentColor"
      />
    ),
  },
  {
    id: 'grammar',
    label: 'Grammar',
    icon: <path d="M4 6h16v2H4V6Zm0 5h10v2H4v-2Zm0 5h16v2H4v-2Z" fill="currentColor" />,
  },
  {
    id: 'listening',
    label: 'Listening',
    icon: (
      <path
        d="M12 3a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h1v-6H5a7 7 0 0 1 14 0h-2v6h1a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9Zm-1 11h2v5h-2v-5Z"
        fill="currentColor"
      />
    ),
  },
  {
    id: 'reading',
    label: 'Reading',
    icon: (
      <path
        d="M18 2H6a2 2 0 0 0-2 2v16l8-3 8 3V4a2 2 0 0 0-2-2Zm0 15.17-6-2.25-6 2.25V4h12v13.17Z"
        fill="currentColor"
      />
    ),
  },
  {
    id: 'writing',
    label: 'Writing',
    icon: (
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
        fill="currentColor"
      />
    ),
  },
  {
    id: 'mock-test',
    label: 'Mock Test',
    icon: (
      <path d="M4 6h16v12H4V6Zm2 2v8h12V8H6Zm2 2h8v2H8v-2Zm0 3h5v2H8v-2Z" fill="currentColor" />
    ),
  },
];

function FocusAreaIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-primary"
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

type FocusAreaTileProps = {
  area: FocusArea;
};

function FocusAreaTile({ area }: FocusAreaTileProps) {
  return (
    <li className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl',
          'border border-surface-container-high bg-surface-container-lowest text-primary shadow-card',
        )}
      >
        <FocusAreaIcon>{area.icon}</FocusAreaIcon>
      </div>
      <span className="text-center text-label-sm text-on-surface-variant">{area.label}</span>
    </li>
  );
}

export function FocusAreaGrid() {
  return (
    <section aria-labelledby="focus-areas-heading">
      <h2 className="m-0 mb-stack-md text-headline-md text-on-surface" id="focus-areas-heading">
        Focus Areas
      </h2>
      <ul className="m-0 grid list-none grid-cols-3 gap-stack-md p-0">
        {FOCUS_AREAS.map((area) => (
          <FocusAreaTile area={area} key={area.id} />
        ))}
      </ul>
    </section>
  );
}
