import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils';

type LoadingStateVariant = 'spinner' | 'skeleton';

type LoadingStateProps = {
  variant?: LoadingStateVariant;
  label?: string;
  className?: string;
};

function LoadingSpinner() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8 animate-spin text-primary motion-reduce:animate-none"
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

export function LoadingState({
  variant = 'spinner',
  label = 'Loading',
  className,
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className={cn('w-full space-y-3', className)}
        role="status"
      >
        <span className="sr-only">{label}</span>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-stack-sm py-stack-lg text-center',
        className,
      )}
      role="status"
    >
      <LoadingSpinner />
      <p className="m-0 text-body-md text-on-surface-variant">{label}</p>
    </div>
  );
}

export type { LoadingStateProps, LoadingStateVariant };
