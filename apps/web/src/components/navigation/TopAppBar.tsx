import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { cn } from '@/utils';

type TopAppBarProps = {
  title: string;
  backTo?: string;
  onBack?: () => void;
  backLabel?: string;
  rightActions?: ReactNode;
  className?: string;
};

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 5 8 11.5 14.5 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function TopAppBar({
  title,
  backTo,
  onBack,
  backLabel = 'Go back',
  rightActions,
  className,
}: TopAppBarProps) {
  const navigate = useNavigate();
  const showBack = Boolean(backTo ?? onBack);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(-1);
  };

  return (
    <header
      className={cn('sticky top-0 z-40 border-b border-surface-container bg-background', className)}
      role="banner"
    >
      <div className="flex items-center justify-between gap-stack-md px-margin-mobile py-stack-md">
        <div className="flex min-w-0 flex-1 items-center gap-stack-sm">
          {showBack &&
            (backTo ? (
              <Link
                aria-label={backLabel}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
                to={backTo}
              >
                <BackIcon />
              </Link>
            ) : (
              <button
                aria-label={backLabel}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-primary ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
                onClick={handleBack}
                type="button"
              >
                <BackIcon />
              </button>
            ))}
          <h1 className="m-0 truncate text-headline-md text-primary">{title}</h1>
        </div>
        {rightActions ? (
          <div className="flex shrink-0 items-center gap-stack-sm">{rightActions}</div>
        ) : null}
      </div>
    </header>
  );
}
