import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

import type { PracticeMode, PracticeModeIconColor, PracticeModeId } from '../types';

type PracticeModeTileProps = {
  mode: PracticeMode;
};

const iconColorStyles: Record<PracticeModeIconColor, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  'on-primary': 'text-on-primary',
};

const practiceModeIcons: Record<PracticeModeId, ReactNode> = {
  vocabulary: (
    <path
      d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H18V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04ZM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12Zm-2.62 7 1.62-4.33L19.12 17h-3.24Z"
      fill="currentColor"
    />
  ),
  grammar: (
    <path
      d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3Zm0 2.18 6 2.25v4.66c0 3.83-2.55 7.37-6 8.38-3.45-1.01-6-4.55-6-8.38V6.43l6-2.25ZM11 8v2H8v2h3v6h2v-6h3v-2h-3V8h-2Z"
      fill="currentColor"
    />
  ),
  listening: (
    <path
      d="M12 3a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h1v-6H5a7 7 0 0 1 14 0h-2v6h1a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9Zm-1 11h2v5h-2v-5Z"
      fill="currentColor"
    />
  ),
  reading: (
    <path
      d="M18 2H6a2 2 0 0 0-2 2v16l8-3 8 3V4a2 2 0 0 0-2-2Zm0 15.17-6-2.25-6 2.25V4h12v13.17Z"
      fill="currentColor"
    />
  ),
  writing: (
    <path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
      fill="currentColor"
    />
  ),
  'mixed-review': (
    <path
      d="m12 2 2.4 4.86 5.37.78-3.89 3.79.92 5.35L12 14.77l-4.8 2.52.92-5.35L4.23 7.64l5.37-.78L12 2Z"
      fill="currentColor"
    />
  ),
};

function PracticeModeIcon({
  modeId,
  iconColor,
}: {
  modeId: PracticeModeId;
  iconColor: PracticeModeIconColor;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn('h-8 w-8', iconColorStyles[iconColor])}
      fill="none"
      height="32"
      viewBox="0 0 24 24"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      {practiceModeIcons[modeId]}
    </svg>
  );
}

export function PracticeModeTile({ mode }: PracticeModeTileProps) {
  const isFeatured = mode.variant === 'featured';

  return (
    <Link
      className={cn(
        'block rounded-xl ring-focus focus-visible:outline-none focus-visible:ring-[3px]',
        'transition-[transform,box-shadow] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100',
      )}
      to={mode.href}
    >
      <Card
        className={cn(
          'flex aspect-square h-full flex-col justify-between border-transparent transition-colors hover:border-primary',
          isFeatured &&
            'border-primary bg-primary text-on-primary shadow-card hover:border-primary',
        )}
      >
        <PracticeModeIcon iconColor={mode.iconColor} modeId={mode.id} />
        <div>
          <h2
            className={cn(
              'm-0 text-label-md font-semibold',
              isFeatured ? 'text-on-primary' : 'text-on-surface',
            )}
          >
            {mode.label}
          </h2>
          <p
            className={cn(
              'm-0 mt-1 text-label-sm',
              isFeatured ? 'text-on-primary/80' : 'text-on-surface-variant',
            )}
          >
            {mode.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
