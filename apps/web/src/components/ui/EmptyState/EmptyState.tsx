import { type ReactNode, useId } from 'react';

import { cn } from '@/utils';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'flex flex-col items-center px-margin-mobile py-stack-lg text-center',
        className,
      )}
    >
      <h2 className="m-0 text-headline-md text-on-surface" id={titleId}>
        {title}
      </h2>
      {description ? (
        <p className="m-0 mt-stack-sm max-w-prose text-body-md text-on-surface-variant">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-stack-md">{action}</div> : null}
    </section>
  );
}

export type { EmptyStateProps };
