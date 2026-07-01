import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/utils';

type InputProps = {
  error?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

function getInputClassName(error: boolean, className?: string): string {
  return cn(
    'block min-h-11 w-full rounded-lg border bg-surface-container-lowest px-stack-md py-2',
    'text-body-md text-on-surface placeholder:text-on-surface-variant',
    'transition-[color,background-color,border-color,box-shadow]',
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
    'disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant',
    error
      ? 'border-error focus-visible:border-error'
      : 'border-outline-variant focus-visible:border-primary',
    className,
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error = false, 'aria-invalid': ariaInvalid, ...props },
  ref,
) {
  return (
    <input
      {...props}
      aria-invalid={ariaInvalid ?? (error || undefined)}
      className={getInputClassName(error, className)}
      ref={ref}
    />
  );
});

export type { InputProps };
