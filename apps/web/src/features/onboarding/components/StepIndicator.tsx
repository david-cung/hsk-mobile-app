import { cn } from '@/utils';

const ONBOARDING_STEP_LABELS = ['Welcome', 'Your goal', 'Study plan'] as const;

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

export function StepIndicator({ currentStep, totalSteps, className }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index);

  return (
    <nav
      aria-label="Onboarding progress"
      className={cn('flex justify-center py-stack-lg', className)}
    >
      <ol className="m-0 flex list-none gap-2 p-0">
        {steps.map((stepIndex) => {
          const isActive = stepIndex === currentStep;
          const isComplete = stepIndex < currentStep;
          const label = ONBOARDING_STEP_LABELS[stepIndex] ?? `Step ${stepIndex + 1}`;

          return (
            <li key={stepIndex}>
              <span
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${label}, step ${stepIndex + 1} of ${totalSteps}${
                  isComplete ? ', completed' : ''
                }`}
                className={cn(
                  'block h-2.5 w-2.5 rounded-full transition-colors',
                  isActive || isComplete ? 'bg-primary' : 'bg-surface-container-highest',
                )}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type { StepIndicatorProps };
