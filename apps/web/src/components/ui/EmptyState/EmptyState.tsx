import { type ReactNode, useId } from 'react';

import { Card } from '@/components/ui/Card';
import { StateIcon, type StateIconName } from '@/components/ui/StateIcon';
import { cn } from '@/utils';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: StateIconName;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon = 'generic',
  className,
}: EmptyStateProps) {
  const titleId = useId();

  return (
    <Card
      aria-labelledby={titleId}
      className={cn(
        'animate-scale-in flex flex-col items-center border-dashed border-outline-variant/50 bg-surface-container-low/80 px-margin-mobile py-stack-lg text-center',
        className,
      )}
    >
      <StateIcon className="mb-stack-md" name={icon} />
      <h2 className="m-0 text-headline-md text-on-surface" id={titleId}>
        {title}
      </h2>
      {description ? (
        <p className="m-0 mt-stack-sm max-w-prose text-body-md text-on-surface-variant">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-stack-md">{action}</div> : null}
    </Card>
  );
}

export type { EmptyStateProps };
