import type { ReactNode } from 'react';

import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

type ResultStatItemProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

function ResultStatItem({ icon, label, value, valueClassName }: ResultStatItemProps) {
  return (
    <Card className="flex flex-col items-center justify-center bg-surface-container-lowest p-stack-md text-center">
      <div className="mb-1 text-primary">{icon}</div>
      <p className="m-0 text-label-sm text-on-surface-variant">{label}</p>
      <p className={cn('m-0 mt-1 text-headline-md text-on-surface', valueClassName)}>{value}</p>
    </Card>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-tertiary"
      fill="currentColor"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 14.2-4.2-4.2 1.4-1.4 2.8 2.8 6-6 1.4 1.4-7.4 7.4Z" />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-primary"
      fill="currentColor"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm3.5 12.1-1.4 1.4L12 13.4l-2.1 2.1-1.4-1.4L10.6 12 8.5 9.9l1.4-1.4L12 10.6l2.1-2.1 1.4 1.4L13.4 12l2.1 2.1Z" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-secondary"
      fill="currentColor"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 5h-2v6l4.2 2.5.9-1.5L13 12.5V7Z" />
    </svg>
  );
}

type ResultStatsProps = {
  correctCount: number;
  wrongCount: number;
  elapsedMs?: number;
};

function formatElapsedDuration(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.round(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

export function ResultStats({ correctCount, wrongCount, elapsedMs }: ResultStatsProps) {
  const thirdStat =
    elapsedMs !== undefined
      ? {
          icon: <TimerIcon />,
          label: 'Time',
          value: formatElapsedDuration(elapsedMs),
        }
      : {
          icon: <TimerIcon />,
          label: 'Answered',
          value: correctCount + wrongCount,
        };

  return (
    <div className="grid grid-cols-3 gap-stack-sm">
      <ResultStatItem
        icon={<CheckIcon />}
        label="Correct"
        value={correctCount}
        valueClassName="text-tertiary"
      />
      <ResultStatItem
        icon={<CancelIcon />}
        label="Wrong"
        value={wrongCount}
        valueClassName="text-primary"
      />
      <ResultStatItem icon={thirdStat.icon} label={thirdStat.label} value={thirdStat.value} />
    </div>
  );
}

export type { ResultStatsProps };
