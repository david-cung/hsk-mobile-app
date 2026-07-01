import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

import { type RecentActivityItem, RecentActivityList } from '../components/RecentActivityList';
import { StatCard } from '../components/StatCard';

const PROGRESS_SUMMARY = {
  hskLevel: 'HSK 3',
  masteredPercent: 65,
  wordsLearned: 420,
  wordsTotal: 600,
  wordsRemaining: 180,
  dailyMinutesStudied: 15,
  dailyGoalMinutes: 30,
  studyStreakDays: 7,
  personalBestStreakDays: 12,
} as const;

const RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: 'mock-test-4',
    title: 'Full Mock Test #4',
    date: '22 Oct, 2023',
    score: '284/300',
    status: 'PASS',
    statusTone: 'pass',
  },
  {
    id: 'listening-focus-b',
    title: 'Listening Focus B',
    date: '15 Oct, 2023',
    score: '82/100',
    status: 'PRACTICE',
    statusTone: 'practice',
  },
  {
    id: 'vocabulary-review',
    title: 'Vocabulary Review',
    date: '12 Oct, 2023',
    score: '91%',
    status: 'COMPLETE',
    statusTone: 'default',
  },
];

function ScheduleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-tertiary"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
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
      className="h-5 w-5 text-secondary"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2c1.5 3 4 4.5 4 8a4 4 0 0 1-8 0c0-3.5 2.5-5 4-8Zm0 18a6 6 0 0 0 6-6h-1.5a4.5 4.5 0 1 1-9 0H6a6 6 0 0 0 6 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ProgressPage() {
  const dailyGoalPercent = Math.round(
    (PROGRESS_SUMMARY.dailyMinutesStudied / PROGRESS_SUMMARY.dailyGoalMinutes) * 100,
  );

  return (
    <>
      <header
        className="border-b border-surface-container bg-surface-container-lowest"
        role="banner"
      >
        <p className="m-0 px-margin-mobile py-stack-md text-headline-md text-primary">Progress</p>
      </header>
      <main
        className="mx-auto flex w-full max-w-lg flex-col gap-stack-lg px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <div>
          <h1 className="m-0 mb-stack-md text-headline-lg-mobile text-on-surface">
            Progress dashboard
          </h1>
          <p className="m-0 max-w-prose text-body-md text-on-surface-variant">
            Track completed lessons, daily study time, streaks, and recent quiz performance.
          </p>
        </div>

        <section aria-labelledby="hsk-level-heading">
          <h2 className="sr-only" id="hsk-level-heading">
            Current HSK level progress
          </h2>
          <Card className="border-surface-container-highest">
            <div className="mb-stack-md flex items-center justify-between gap-stack-sm">
              <Badge variant="primary">{PROGRESS_SUMMARY.hskLevel}</Badge>
              <span className="text-label-md text-on-surface">
                {PROGRESS_SUMMARY.masteredPercent}% Mastered
              </span>
            </div>
            <ProgressBar
              aria-label={`${PROGRESS_SUMMARY.hskLevel} mastery progress`}
              color="primary"
              value={PROGRESS_SUMMARY.masteredPercent}
            />
            <p className="m-0 mt-stack-sm text-label-sm text-on-surface-variant">
              {PROGRESS_SUMMARY.wordsLearned} / {PROGRESS_SUMMARY.wordsTotal} words learned
            </p>
            <p className="m-0 mt-stack-md text-headline-md text-on-surface">Keep it up!</p>
            <p className="m-0 mt-1 text-body-md text-on-surface-variant">
              You&apos;re only {PROGRESS_SUMMARY.wordsRemaining} words away from mastery.
            </p>
          </Card>
        </section>

        <section aria-labelledby="progress-stats-heading" className="grid grid-cols-2 gap-stack-md">
          <h2 className="sr-only" id="progress-stats-heading">
            Study stats
          </h2>
          <StatCard
            icon={<ScheduleIcon />}
            label="Daily goal"
            progress={{
              ariaLabel: 'Daily study goal progress',
              color: 'tertiary',
              value: dailyGoalPercent,
            }}
            value={
              <>
                {PROGRESS_SUMMARY.dailyMinutesStudied}/{PROGRESS_SUMMARY.dailyGoalMinutes}{' '}
                <span className="text-label-sm text-on-surface-variant">min</span>
              </>
            }
          />
          <StatCard
            detail={
              <p className="m-0 text-label-sm text-on-surface-variant">
                Personal best: {PROGRESS_SUMMARY.personalBestStreakDays} days
              </p>
            }
            icon={<StreakIcon />}
            label="Study streak"
            value={`${PROGRESS_SUMMARY.studyStreakDays} days`}
          />
        </section>

        <RecentActivityList items={RECENT_ACTIVITY} />
      </main>
    </>
  );
}
