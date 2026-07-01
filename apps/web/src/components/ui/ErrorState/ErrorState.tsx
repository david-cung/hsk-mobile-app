import { type ReactNode, useId } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StateIcon } from '@/components/ui/StateIcon';
import { cn } from '@/utils';

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Check your connection and try again.',
  onRetry,
  retryLabel = 'Try again',
  action,
  className,
}: ErrorStateProps) {
  const titleId = useId();

  return (
    <Card
      aria-labelledby={titleId}
      className={cn(
        'animate-scale-in flex flex-col items-center border-error/20 bg-error-container/30 px-margin-mobile py-stack-lg text-center',
        className,
      )}
      role="alert"
    >
      <StateIcon className="mb-stack-md bg-error-container/50 text-error" name="error" />
      <h2 className="m-0 text-headline-md text-on-error-container" id={titleId}>
        {title}
      </h2>
      {description ? (
        <p className="m-0 mt-stack-sm max-w-prose text-body-md text-on-error-container/90">
          {description}
        </p>
      ) : null}
      {action ??
        (onRetry ? (
          <Button className="mt-stack-md" onClick={onRetry} type="button" variant="secondary">
            {retryLabel}
          </Button>
        ) : null)}
    </Card>
  );
}

export type { ErrorStateProps };
