import { Button } from '@/components/ui/Button';

type QuizFooterProps = {
  hasSelection: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  onContinue: () => void;
};

export function QuizFooter({
  hasSelection,
  isLastQuestion,
  isSubmitting,
  onContinue,
}: QuizFooterProps) {
  const actionLabel = isLastQuestion ? 'Submit quiz' : 'Next question';

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-outline-variant/40 bg-background/90 px-margin-mobile py-stack-md backdrop-blur-md">
      <Button
        aria-label={hasSelection ? actionLabel : `${actionLabel} (select an answer to continue)`}
        disabled={!hasSelection}
        fullWidth
        loading={isSubmitting}
        onClick={onContinue}
        type="button"
      >
        {actionLabel}
      </Button>
    </div>
  );
}

export type { QuizFooterProps };
