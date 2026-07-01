import { ChineseText } from '@/components/typography';
import { cn } from '@/utils';

function OnboardingIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto mb-stack-lg flex aspect-square w-full max-w-xs items-center justify-center"
    >
      <div className="absolute inset-0 scale-90 rounded-full bg-surface-container opacity-60 blur-3xl" />
      <div className="relative z-10 w-full max-w-[280px] rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-card-padding shadow-card">
        <div className="mb-stack-md flex items-center justify-between">
          <span className="rounded-full bg-tertiary-container/15 px-2 py-0.5 text-label-sm font-semibold text-tertiary">
            HSK 1
          </span>
          <span className="rounded-full bg-secondary-container/30 px-2 py-0.5 text-label-sm font-semibold text-secondary">
            Lesson 1
          </span>
        </div>
        <ChineseText
          as="p"
          className="m-0 text-center text-display-zh text-primary"
          variant="display"
        >
          你好
        </ChineseText>
        <p className="m-0 mt-stack-sm text-center text-body-md font-medium text-primary">nǐ hǎo</p>
        <p className="m-0 mt-1 text-center text-body-md text-on-surface-variant">Hello</p>
        <div className="mt-stack-md flex justify-center gap-2">
          <span className="h-2 w-8 rounded-full bg-primary" />
          <span className="h-2 w-3 rounded-full bg-surface-container-high" />
          <span className="h-2 w-3 rounded-full bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}

type WelcomeStepProps = {
  className?: string;
};

export function WelcomeStep({ className }: WelcomeStepProps) {
  return (
    <section
      aria-labelledby="onboarding-welcome-title"
      className={cn('flex flex-1 flex-col justify-center text-center', className)}
    >
      <OnboardingIllustration />
      <h1 className="m-0 text-headline-lg-mobile text-primary" id="onboarding-welcome-title">
        Learn Chinese step by step
      </h1>
      <p className="m-0 mt-stack-md px-4 text-body-md text-on-surface-variant">
        Study vocabulary, grammar, listening, reading, and writing organized by HSK level.
      </p>
    </section>
  );
}

export type { WelcomeStepProps };
