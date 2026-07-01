import { forwardRef, type LabelHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils';

type LabelProps = {
  children: ReactNode;
  required?: boolean;
} & LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, children, required = false, ...props },
  ref,
) {
  return (
    <label
      {...props}
      className={cn('mb-1 block text-label-md text-on-surface', className)}
      ref={ref}
    >
      {children}
      {required ? (
        <>
          <span aria-hidden="true" className="ml-0.5 text-error">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      ) : null}
    </label>
  );
});

export type { LabelProps };
