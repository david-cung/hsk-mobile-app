import type { ReactNode } from 'react';

import { cn } from '@/utils';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
};

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <section
      className={cn(
        'flex items-center justify-between gap-stack-md px-margin-mobile pb-stack-lg pt-stack-md',
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="m-0 text-headline-lg-mobile text-on-surface">{title}</h1>
        {subtitle ? (
          <p className="m-0 mt-1 text-label-md text-on-surface-variant">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </section>
  );
}
