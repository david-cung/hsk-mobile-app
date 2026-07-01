import type { ReactNode } from 'react';

import { Card } from '@/components/ui/Card';
import { ProgressBar, type ProgressBarColor } from '@/components/ui/ProgressBar';
import { cn } from '@/utils';

type StatCardProgress = {
  ariaLabel: string;
  color?: ProgressBarColor;
  value: number;
};

type StatCardProps = {
  className?: string;
  detail?: ReactNode;
  icon?: ReactNode;
  label: string;
  progress?: StatCardProgress;
  value: ReactNode;
};

export function StatCard({ className, detail, icon, label, progress, value }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col justify-between', className)}>
      <div className="mb-stack-sm flex items-center gap-2">
        {icon}
        <h3 className="m-0 text-label-sm text-on-surface-variant">{label}</h3>
      </div>
      <div>
        <div className="text-headline-md text-on-surface">{value}</div>
        {detail ? <div className="mt-1">{detail}</div> : null}
        {progress ? (
          <ProgressBar
            aria-label={progress.ariaLabel}
            className="mt-2 h-1"
            color={progress.color ?? 'primary'}
            value={progress.value}
          />
        ) : null}
      </div>
    </Card>
  );
}

export type { StatCardProgress, StatCardProps };
