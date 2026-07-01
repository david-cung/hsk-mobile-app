import { useId } from 'react';

import { toDailyGoalOptions, toHskLevelOptions } from '@/app/config/studyGoals';
import { GoalChipGroup } from '@/components/forms/GoalChipGroup';
import { cn } from '@/utils';

type LevelGoalStepProps = {
  targetHskLevel: number;
  dailyGoalMinutes: number;
  onTargetLevelChange: (level: number) => void;
  onDailyGoalChange: (minutes: number) => void;
  className?: string;
};

const hskLevelOptions = toHskLevelOptions();
const dailyGoalOptions = toDailyGoalOptions();

export function LevelGoalStep({
  targetHskLevel,
  dailyGoalMinutes,
  onTargetLevelChange,
  onDailyGoalChange,
  className,
}: LevelGoalStepProps) {
  const headingId = useId();
  const targetLevelLabelId = useId();
  const dailyGoalLabelId = useId();

  return (
    <section aria-labelledby={headingId} className={cn('flex flex-1 flex-col', className)}>
      <div className="mb-stack-lg text-center">
        <h1 className="m-0 text-headline-lg-mobile text-on-surface" id={headingId}>
          Set your study plan
        </h1>
        <p className="m-0 mt-stack-sm text-body-md text-on-surface-variant">
          Pick a target HSK level and a daily study goal that fits your schedule.
        </p>
      </div>

      <div className="flex flex-col gap-stack-lg">
        <div>
          <p
            className="m-0 mb-stack-sm text-label-md font-semibold text-on-surface"
            id={targetLevelLabelId}
          >
            Target HSK level
          </p>
          <GoalChipGroup
            ariaLabelledBy={targetLevelLabelId}
            columns={3}
            onChange={onTargetLevelChange}
            options={hskLevelOptions}
            value={targetHskLevel}
          />
        </div>

        <div>
          <p
            className="m-0 mb-stack-sm text-label-md font-semibold text-on-surface"
            id={dailyGoalLabelId}
          >
            Daily study goal
          </p>
          <GoalChipGroup
            ariaLabelledBy={dailyGoalLabelId}
            onChange={onDailyGoalChange}
            options={dailyGoalOptions}
            value={dailyGoalMinutes}
          />
        </div>
      </div>
    </section>
  );
}

export type { LevelGoalStepProps };
