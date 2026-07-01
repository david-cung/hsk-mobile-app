import { cn } from '@/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonStyleOptions = {
  variant: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
};

const buttonBaseStyles = cn(
  'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-stack-md py-2',
  'text-label-md font-semibold transition-[color,background-color,border-color,opacity,transform]',
  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'motion-safe:active:scale-[0.98]',
);

const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-primary text-on-primary shadow-button',
    'hover:bg-primary-container',
    'disabled:hover:bg-primary',
  ),
  secondary: cn(
    'border border-primary bg-transparent text-primary',
    'hover:bg-primary/5',
    'disabled:hover:bg-transparent',
  ),
  ghost: cn(
    'bg-transparent text-on-surface',
    'hover:bg-surface-container-high',
    'disabled:hover:bg-transparent',
  ),
};

export function getButtonClassName({
  variant,
  fullWidth = false,
  className,
}: ButtonStyleOptions): string {
  return cn(buttonBaseStyles, buttonVariantStyles[variant], fullWidth && 'w-full', className);
}
