import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils';

export type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'outline';

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

const badgeBaseStyles = cn(
  'inline-flex items-center justify-center rounded-full px-2 py-1',
  'text-label-sm font-semibold whitespace-nowrap',
);

const badgeVariantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-fixed text-on-primary-fixed',
  secondary: 'bg-secondary-fixed text-on-secondary-fixed',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed',
  outline: 'border border-outline-variant bg-transparent text-on-surface-variant',
};

function getBadgeClassName(variant: BadgeVariant, className?: string): string {
  return cn(badgeBaseStyles, badgeVariantStyles[variant], className);
}

export function Badge({ variant = 'primary', className, children, ...props }: BadgeProps) {
  return (
    <span {...props} className={getBadgeClassName(variant, className)}>
      {children}
    </span>
  );
}

export type { BadgeProps };
