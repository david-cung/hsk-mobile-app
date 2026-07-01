import { ProgressBar } from '@/components/ui/ProgressBar';

type QuizProgressProps = {
  currentQuestionNumber: number;
  totalQuestions: number;
};

function calculateProgressPercent(currentQuestionNumber: number, totalQuestions: number): number {
  if (totalQuestions <= 0) {
    return 0;
  }

  return (currentQuestionNumber / totalQuestions) * 100;
}

export function QuizProgress({ currentQuestionNumber, totalQuestions }: QuizProgressProps) {
  const progressPercent = Math.round(
    calculateProgressPercent(currentQuestionNumber, totalQuestions),
  );
  const progressLabel = `Question ${currentQuestionNumber} of ${totalQuestions}`;

  return (
    <div aria-live="polite" className="mb-stack-lg">
      <div className="mb-2 flex items-end justify-between gap-stack-md">
        <p className="m-0 text-label-md text-on-surface-variant">{progressLabel}</p>
        <p className="m-0 text-label-md font-semibold text-primary">{progressPercent}%</p>
      </div>
      <ProgressBar aria-label={progressLabel} color="primary" value={progressPercent} />
    </div>
  );
}

export type { QuizProgressProps };
