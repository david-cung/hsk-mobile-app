import type { ComponentType } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/utils';

import type { LevelRoadmapItem, LevelRoadmapStatus } from '../types';

type LevelRoadmapCardProps = {
  level: LevelRoadmapItem;
};

function CheckCircleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-primary"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 13.2-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4-6.3 6.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlayCircleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-primary"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-2 14.3V7.7l6.3 4.3-6.3 4.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-outline"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 9h-1V7a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-3 0H10V7a2 2 0 1 1 4 0v2Z"
        fill="currentColor"
      />
    </svg>
  );
}

const statusIcon: Record<LevelRoadmapStatus, ComponentType> = {
  completed: CheckCircleIcon,
  active: PlayCircleIcon,
  locked: LockIcon,
};

const statusLabels: Record<LevelRoadmapStatus, string> = {
  completed: 'Completed',
  active: 'Active',
  locked: 'Locked',
};

type MetricTileProps = {
  label: string;
  learned: number;
  total: number;
  status: LevelRoadmapStatus;
};

function MetricTile({ label, learned, total, status }: MetricTileProps) {
  const isLocked = status === 'locked';
  const isActive = status === 'active';

  return (
    <div
      className={cn(
        'rounded-lg p-3',
        isLocked && 'bg-surface-container-highest',
        status === 'completed' && 'bg-surface-container',
        isActive && 'border border-primary-fixed bg-surface-container-low',
      )}
    >
      <p className="m-0 text-label-sm text-on-surface-variant">{label}</p>
      <p
        className={cn(
          'm-0 mt-1 text-body-md',
          isLocked && 'text-outline',
          isActive && 'font-semibold text-primary',
          status === 'completed' && 'text-on-surface',
        )}
      >
        {learned}/{total}
      </p>
    </div>
  );
}

export function LevelRoadmapCard({ level }: LevelRoadmapCardProps) {
  const StatusIcon = statusIcon[level.status];
  const isLocked = level.status === 'locked';
  const isActive = level.status === 'active';
  const isCompleted = level.status === 'completed';

  return (
    <article
      aria-label={`${level.levelLabel}: ${level.title}. ${statusLabels[level.status]}.`}
      className={cn('w-full', isLocked && 'opacity-60')}
    >
      <Card
        className={cn(
          'relative w-full',
          isCompleted && 'border-l-4 border-l-primary',
          isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
          isLocked && 'border-outline-variant/40 bg-surface-dim shadow-none',
        )}
      >
        {isActive ? (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-label-sm uppercase tracking-wider text-on-primary">
            Active Path
          </span>
        ) : null}

        <div className={cn('flex items-start justify-between gap-stack-sm', isActive && 'mt-2')}>
          <div>
            <Badge
              className={cn(
                isLocked
                  ? 'bg-outline-variant text-on-surface-variant'
                  : 'bg-primary text-on-primary',
              )}
              variant={isLocked ? 'outline' : 'primary'}
            >
              {level.levelLabel}
            </Badge>
            <h2 className="m-0 mt-2 text-headline-md text-on-surface">{level.title}</h2>
          </div>
          <StatusIcon />
        </div>

        <div className="mt-stack-md grid grid-cols-2 gap-4">
          <MetricTile
            label="Vocabulary"
            learned={level.metrics.vocabularyLearned}
            status={level.status}
            total={level.metrics.vocabularyTotal}
          />
          <MetricTile
            label="Grammar"
            learned={level.metrics.grammarLearned}
            status={level.status}
            total={level.metrics.grammarTotal}
          />
        </div>

        <div
          className={cn(
            'mt-stack-md flex items-center justify-between gap-stack-sm',
            isActive && 'mb-stack-md',
          )}
        >
          <p
            className={cn('m-0 text-label-sm text-on-surface-variant', isActive && 'font-semibold')}
          >
            Completion: {level.completionPercent}%
          </p>
          <ProgressBar
            aria-label={`${level.levelLabel} completion progress`}
            className="w-32"
            color={isLocked ? 'tertiary' : isActive ? 'primary' : 'secondary'}
            value={level.completionPercent}
          />
        </div>

        {isActive ? (
          <Button fullWidth type="button">
            Continue learning
          </Button>
        ) : null}
      </Card>
    </article>
  );
}
