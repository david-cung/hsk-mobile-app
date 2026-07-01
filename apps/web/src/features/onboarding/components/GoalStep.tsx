import type { ReactNode } from 'react';
import { useId } from 'react';

import { cn } from '@/utils';

import { GoalCard, type OnboardingGoal, type OnboardingGoalId } from './GoalCard';

const GOAL_ICONS: Record<OnboardingGoalId, ReactNode> = {
  travel: (
    <path
      d="M10.18 9 8.11 13.27 2 15l4.91 4.26L9.5 22l1.18-4.34L15 15l-6.11-1.73L10.18 9ZM19 3l-6 6h2v4h4v-4h2l-6-6Z"
      fill="currentColor"
    />
  ),
  business: (
    <path
      d="M10 16v-1H4v1c0 2.21 3.58 4 6 4s6-1.79 6-4ZM4 13c0 2.21 3.58 4 6 4s6-1.79 6-4V5H4v8ZM12 2c2.76 0 5 1.79 5 4H7c0-2.21 2.24-4 5-4Z"
      fill="currentColor"
    />
  ),
  hsk_exam: (
    <path
      d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82ZM12 3 1 9l11 6 9-4.91V17h2V9L12 3Z"
      fill="currentColor"
    />
  ),
  culture: (
    <path
      d="M12 2C8.5 2 6 4.24 6 7c0 2.85 2.92 7.21 5.33 9.88a1 1 0 0 0 1.34 0C14.08 14.21 18 9.85 18 7c0-2.76-2.5-5-6-5Zm0 9.5A5.5 5.5 0 0 1 8 7c0-1.93 1.79-3.5 4-3.5s4 1.57 4 3.5a5.5 5.5 0 0 1-4 4.5Z"
      fill="currentColor"
    />
  ),
};

const ONBOARDING_GOALS: OnboardingGoal[] = [
  { id: 'travel', label: 'Travel', icon: GOAL_ICONS.travel },
  { id: 'business', label: 'Business', icon: GOAL_ICONS.business },
  { id: 'hsk_exam', label: 'HSK Exam', icon: GOAL_ICONS.hsk_exam },
  { id: 'culture', label: 'Culture', icon: GOAL_ICONS.culture },
];

type GoalStepProps = {
  selectedGoal: OnboardingGoalId;
  onSelectGoal: (goalId: OnboardingGoalId) => void;
  className?: string;
};

export function GoalStep({ selectedGoal, onSelectGoal, className }: GoalStepProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={cn('flex flex-1 flex-col', className)}>
      <div className="mb-stack-lg text-center">
        <h1 className="m-0 text-headline-lg-mobile text-on-surface" id={headingId}>
          What is your goal?
        </h1>
        <p className="m-0 mt-stack-sm text-body-md text-on-surface-variant">
          Choose what matters most so we can personalize your learning path.
        </p>
      </div>

      <div aria-labelledby={headingId} className="grid grid-cols-2 gap-stack-md" role="radiogroup">
        {ONBOARDING_GOALS.map((goal) => (
          <GoalCard
            goal={goal}
            key={goal.id}
            onSelect={onSelectGoal}
            selected={selectedGoal === goal.id}
          />
        ))}
      </div>
    </section>
  );
}

export type { GoalStepProps };
