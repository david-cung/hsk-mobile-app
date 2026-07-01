import { type ReactNode } from 'react';

import { cn } from '@/utils';

type FieldErrorProps = {
  id?: string;
  children?: ReactNode;
  className?: string;
};

export function FieldError({ id, children, className }: FieldErrorProps) {
  if (children == null || children === '') {
    return null;
  }

  return (
    <p className={cn('mt-1 text-label-sm text-error', className)} id={id} role="alert">
      {children}
    </p>
  );
}

export type { FieldErrorProps };
