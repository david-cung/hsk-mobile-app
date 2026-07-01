import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';

import { cn } from '@/utils';

import { type ButtonVariant, getButtonClassName } from './button.styles';

type ButtonProps = {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

function ButtonSpinner() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0 animate-spin motion-reduce:animate-none"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        fill="currentColor"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    loading = false,
    disabled = false,
    fullWidth = false,
    type = 'button',
    className,
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={getButtonClassName({ variant, fullWidth, className })}
      disabled={isDisabled}
      ref={ref}
      type={type}
    >
      {loading ? <ButtonSpinner /> : null}
      <span className={cn('inline-flex items-center justify-center', loading && 'opacity-80')}>
        {children}
      </span>
      {loading ? <span className="sr-only">Loading</span> : null}
    </button>
  );
});

export type { ButtonProps, ButtonVariant };
