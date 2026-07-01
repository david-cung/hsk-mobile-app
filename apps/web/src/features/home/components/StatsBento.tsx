import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

const HOME_STATS = {
  hskLevel: 'HSK 3',
  masteredPercent: 65,
  charactersLearned: 142,
  charactersTotal: 218,
  dailyMinutesStudied: 15,
  dailyGoalMinutes: 30,
  studyStreakDays: 7,
  personalBestStreakDays: 12,
} as const;

function ScheduleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mb-stack-sm h-6 w-6 text-tertiary"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 11h4v-2h-3V7h-2v6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StreakIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mb-stack-sm h-6 w-6 text-secondary"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2c1.5 3 4 4.5 4 8a4 4 0 0 1-8 0c0-3.5 2.5-5 4-8Zm0 18a6 6 0 0 0 6-6h-1.5a4.5 4.5 0 1 1-9 0H6a6 6 0 0 0 6 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

type StatTileProps = {
  icon: ReactNode;
  label: string;
  children: ReactNode;
};

function StatTile({ icon, label, children }: StatTileProps) {
  return (
    <Card className="flex min-h-[9.5rem] flex-col justify-between">
      <div>
        {icon}
        <h3 className="m-0 text-label-md text-on-surface-variant">{label}</h3>
      </div>
      <div>{children}</div>
    </Card>
  );
}

export function StatsBento() {
  const dailyGoalPercent = Math.round(
    (HOME_STATS.dailyMinutesStudied / HOME_STATS.dailyGoalMinutes) * 100,
  );

  return (
    <section aria-labelledby="home-stats-heading" className="grid grid-cols-2 gap-stack-md">
      <h2 className="sr-only" id="home-stats-heading">
        Your progress
      </h2>

      <Card className="col-span-2">
        <div className="mb-stack-md flex items-center justify-between gap-stack-sm">
          <Badge variant="primary">{HOME_STATS.hskLevel}</Badge>
          <span className="text-label-md text-on-surface">
            {HOME_STATS.masteredPercent}% Mastered
          </span>
        </div>
        <ProgressBar
          aria-label={`${HOME_STATS.hskLevel} mastery progress`}
          color="primary"
          value={HOME_STATS.masteredPercent}
        />
        <p className="m-0 mt-stack-sm text-label-sm text-on-surface-variant">
          {HOME_STATS.charactersLearned} / {HOME_STATS.charactersTotal} Characters
        </p>
      </Card>

      <StatTile icon={<ScheduleIcon />} label="Daily Goal">
        <p className="m-0 mb-1 text-headline-md text-on-surface">
          {HOME_STATS.dailyMinutesStudied}/{HOME_STATS.dailyGoalMinutes}{' '}
          <span className="text-label-sm text-on-surface-variant">min</span>
        </p>
        <ProgressBar
          aria-label="Daily study goal progress"
          className="h-1.5"
          color="tertiary"
          value={dailyGoalPercent}
        />
      </StatTile>

      <StatTile icon={<StreakIcon />} label="Study Streak">
        <p className="m-0 text-headline-md text-on-surface">{HOME_STATS.studyStreakDays} Days</p>
        <p className="m-0 mt-1 text-label-sm text-on-surface-variant">
          Personal Best: {HOME_STATS.personalBestStreakDays}
        </p>
      </StatTile>
    </section>
  );
}
