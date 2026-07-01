import type { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

import { StepIndicator } from './StepIndicator';

type OnboardingLayoutProps = {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  nextLabel: string;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  showBack?: boolean;
  className?: string;
};

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  nextLabel,
  onNext,
  onBack,
  onSkip,
  showBack = false,
  className,
}: OnboardingLayoutProps) {
  const handleSkip = onSkip ?? (() => undefined);

  return (
    <div className={cn('flex min-h-dvh flex-col bg-background', className)}>
      <header className="sticky top-0 z-40 flex justify-end bg-background/95 px-margin-mobile py-stack-md backdrop-blur-sm sm:px-6">
        <button
          className="min-h-11 rounded-md px-stack-sm text-label-md font-medium text-primary ring-focus transition-colors duration-200 motion-safe:hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-[3px]"
          onClick={handleSkip}
          type="button"
        >
          Skip
        </button>
      </header>

      <main
        className="mx-auto flex w-full max-w-md flex-1 flex-col px-margin-mobile pb-stack-lg pt-stack-sm sm:px-6"
        id="main-content"
        tabIndex={-1}
      >
        <div className="flex flex-1 flex-col page-enter" key={currentStep}>
          {children}
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <footer className="flex flex-col gap-stack-md pt-stack-md">
          {showBack && onBack ? (
            <Button fullWidth onClick={onBack} type="button" variant="ghost">
              Back
            </Button>
          ) : null}
          <Button fullWidth onClick={onNext} type="button">
            {nextLabel}
          </Button>
        </footer>
      </main>
    </div>
  );
}

export type { OnboardingLayoutProps };
