import type { ReactNode } from 'react';

import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

export type OnboardingGoalId = 'business' | 'culture' | 'hsk_exam' | 'travel';

export type OnboardingGoal = {
  id: OnboardingGoalId;
  label: string;
  icon: ReactNode;
};

type GoalCardProps = {
  goal: OnboardingGoal;
  selected: boolean;
  onSelect: (goalId: OnboardingGoalId) => void;
};

export function GoalCard({ goal, selected, onSelect }: GoalCardProps) {
  return (
    <button
      aria-checked={selected}
      className={cn(
        'w-full rounded-xl text-left ring-focus focus-visible:outline-none focus-visible:ring-[3px]',
        'motion-safe:active:scale-[0.98] motion-reduce:active:scale-100',
      )}
      onClick={() => {
        onSelect(goal.id);
      }}
      role="radio"
      type="button"
    >
      <Card
        className={cn(
          'flex flex-col items-center gap-stack-sm border-2 text-center transition-colors',
          selected
            ? 'border-primary bg-primary/5 shadow-card'
            : 'border-transparent hover:border-primary/40',
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full',
            selected ? 'bg-primary text-on-primary' : 'bg-surface-container text-primary',
          )}
        >
          <svg
            className="h-7 w-7"
            fill="currentColor"
            height="28"
            viewBox="0 0 24 24"
            width="28"
            xmlns="http://www.w3.org/2000/svg"
          >
            {goal.icon}
          </svg>
        </div>
        <span
          className={cn(
            'text-label-md font-semibold',
            selected ? 'text-primary' : 'text-on-surface',
          )}
        >
          {goal.label}
        </span>
      </Card>
    </button>
  );
}

export type { GoalCardProps };
