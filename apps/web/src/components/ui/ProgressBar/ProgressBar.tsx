import { type HTMLAttributes } from 'react';

import { cn } from '@/utils';

export type ProgressBarColor = 'primary' | 'secondary' | 'tertiary' | 'error';

type ProgressBarProps = {
  value: number;
  color?: ProgressBarColor;
  'aria-label': string;
} & Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role' | 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax'
>;

const trackStyles = 'h-2 w-full overflow-hidden rounded-full bg-surface-container-high';

const fillBaseStyles = cn(
  'h-full rounded-full',
  'transition-[width] duration-300 ease-out motion-reduce:transition-none',
);

const fillColorStyles: Record<ProgressBarColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary-fixed-dim',
  tertiary: 'bg-tertiary-container',
  error: 'bg-error',
};

function clampProgress(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export function ProgressBar({
  value,
  color = 'primary',
  className,
  'aria-label': ariaLabel,
  ...props
}: ProgressBarProps) {
  const progressValue = clampProgress(value);

  return (
    <div
      {...props}
      aria-label={ariaLabel}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={progressValue}
      className={cn(trackStyles, className)}
      role="progressbar"
    >
      <div
        className={cn(fillBaseStyles, fillColorStyles[color])}
        style={{ width: `${progressValue}%` }}
      />
    </div>
  );
}

export type { ProgressBarProps };
