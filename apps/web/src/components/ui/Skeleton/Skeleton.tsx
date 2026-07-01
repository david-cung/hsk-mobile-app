import { type HTMLAttributes } from 'react';

import { cn } from '@/utils';

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  circle?: boolean;
};

export function Skeleton({ circle = false, className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-surface-container-high motion-reduce:animate-none',
        circle ? 'rounded-full' : 'rounded-md',
        className,
      )}
    />
  );
}

export type { SkeletonProps };
