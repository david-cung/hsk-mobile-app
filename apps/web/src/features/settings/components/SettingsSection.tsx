import type { ReactNode } from 'react';

import { cn } from '@/utils';

type SettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SettingsSection({ title, description, children, className }: SettingsSectionProps) {
  const headingId = `settings-${title.toLowerCase().replace(/\s+/g, '-')}-heading`;

  return (
    <section aria-labelledby={headingId} className={cn('mb-stack-lg', className)}>
      <h2 className="m-0 mb-stack-sm text-headline-md text-on-surface" id={headingId}>
        {title}
      </h2>
      {description ? (
        <p className="m-0 mb-stack-md text-body-md text-on-surface-variant">{description}</p>
      ) : null}
      {children}
    </section>
  );
}

export type { SettingsSectionProps };
