import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils';

type CardProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-card-padding shadow-card',
        className,
      )}
      ref={ref}
    >
      {children}
    </div>
  );
});

export type { CardProps };
