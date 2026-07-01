import type { ReactNode } from 'react';

import { TopAppBar } from '@/components/navigation/TopAppBar';

import { QuizFooter } from './QuizFooter';
import { QuizProgress } from './QuizProgress';

type QuizShellProps = {
  title: string;
  backTo: string;
  currentQuestionNumber: number;
  totalQuestions: number;
  hasSelection: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  onContinue: () => void;
  children: ReactNode;
};

export function QuizShell({
  title,
  backTo,
  currentQuestionNumber,
  totalQuestions,
  hasSelection,
  isLastQuestion,
  isSubmitting,
  onContinue,
  children,
}: QuizShellProps) {
  return (
    <>
      <TopAppBar backLabel="Back to lesson" backTo={backTo} title={title} />
      <main
        className="mx-auto w-full max-w-lg px-margin-mobile pb-[calc(88px+env(safe-area-inset-bottom,0px))] pt-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <QuizProgress
          currentQuestionNumber={currentQuestionNumber}
          totalQuestions={totalQuestions}
        />
        {children}
      </main>
      <QuizFooter
        hasSelection={hasSelection}
        isLastQuestion={isLastQuestion}
        isSubmitting={isSubmitting}
        onContinue={onContinue}
      />
    </>
  );
}

export type { QuizShellProps };
