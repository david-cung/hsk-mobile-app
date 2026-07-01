import { type HTMLAttributes } from 'react';

import { cn } from '@/utils';

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  circle?: boolean;
  shimmer?: boolean;
};

export function Skeleton({ circle = false, shimmer = true, className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn(
        'bg-surface-container-high motion-reduce:animate-none',
        shimmer ? 'animate-shimmer' : 'animate-pulse',
        circle ? 'rounded-full' : 'rounded-lg',
        className,
      )}
    />
  );
}

export type { SkeletonProps };
