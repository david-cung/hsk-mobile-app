import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils';

type CardVariant = 'default' | 'interactive';

type CardProps = {
  children: ReactNode;
  variant?: CardVariant;
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, variant = 'default', ...props },
  ref,
) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-xl border bg-surface-container-lowest p-card-padding shadow-card',
        variant === 'interactive'
          ? 'interactive-card border-outline-variant/30'
          : 'border-outline-variant/30',
        className,
      )}
      ref={ref}
    >
      {children}
    </div>
  );
});

export type { CardProps, CardVariant };
