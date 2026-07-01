import { type ReactNode, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useUiStore } from '@/app/store/ui.store';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useLesson } from '@/features/lessons/hooks/useLesson';
import { isApiError } from '@/services';

import { QuestionRenderer } from '../components/QuestionRenderer';
import { QuizShell } from '../components/QuizShell';
import { useQuizQuestions } from '../hooks/useQuizQuestions';
import { useSubmitQuiz } from '../hooks/useSubmitQuiz';
import {
  selectQuizAnswerForQuestion,
  selectQuizCurrentIndex,
  useQuizSessionStore,
} from '../store/quizSession.store';

function parseLessonId(lessonIdParam: string | undefined): number | undefined {
  if (lessonIdParam === undefined) {
    return undefined;
  }

  const lessonId = Number(lessonIdParam);

  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    return undefined;
  }

  return lessonId;
}

type QuizStatusLayoutProps = {
  backTo: string;
  children: ReactNode;
  title: string;
};

function QuizStatusLayout({ backTo, children, title }: QuizStatusLayoutProps) {
  return (
    <>
      <TopAppBar backLabel="Back to lesson" backTo={backTo} title={title} />
      <main
        className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
    </>
  );
}

type QuizSessionViewProps = {
  lessonId: number;
};

function QuizSessionView({ lessonId }: QuizSessionViewProps) {
  const navigate = useNavigate();
  const showToast = useUiStore((state) => state.showToast);
  const currentIndex = useQuizSessionStore(selectQuizCurrentIndex);
  const reset = useQuizSessionStore((state) => state.reset);
  const next = useQuizSessionStore((state) => state.next);

  const { data: lesson } = useLesson({ lessonId });
  const { data: questions, error, isError, isLoading } = useQuizQuestions({ lessonId });

  const { isPending: isSubmitting, mutate: submitQuiz } = useSubmitQuiz({
    onSuccess: (result) => {
      reset();
      navigate(`/lessons/${lessonId}/quiz/result`, {
        replace: true,
        state: {
          lessonTitle: lesson?.title,
          result,
        },
      });
    },
    onError: (submitError) => {
      const message = isApiError(submitError)
        ? submitError.message
        : 'Unable to submit your quiz. Please try again.';

      showToast({
        message,
        variant: 'error',
        title: 'Submission failed',
      });
    },
  });

  useEffect(() => {
    reset();

    return () => {
      reset();
    };
  }, [lessonId, reset]);

  const pageTitle = lesson?.title ?? 'Quiz';
  const backTo = `/lessons/${lessonId}`;
  const totalQuestions = questions?.length ?? 0;
  const currentQuestion = questions?.[currentIndex];
  const currentQuestionNumber = totalQuestions > 0 ? currentIndex + 1 : 0;
  const isLastQuestion = totalQuestions > 0 && currentIndex === totalQuestions - 1;
  const selectedAnswer = useQuizSessionStore(
    selectQuizAnswerForQuestion(currentQuestion?.id ?? -1),
  );
  const hasSelection = selectedAnswer !== undefined && selectedAnswer.length > 0;

  const handleContinue = () => {
    if (!currentQuestion || !hasSelection) {
      return;
    }

    if (isLastQuestion) {
      submitQuiz({ lessonId, answers: useQuizSessionStore.getState().answers });
      return;
    }

    next();
  };

  if (isLoading) {
    return (
      <QuizStatusLayout backTo={backTo} title={pageTitle}>
        <LoadingState label="Loading quiz questions" />
      </QuizStatusLayout>
    );
  }

  if (isError) {
    return (
      <QuizStatusLayout backTo={backTo} title={pageTitle}>
        <EmptyState
          action={
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-stack-md py-2 text-label-md font-semibold text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
              to={backTo}
            >
              Back to lesson
            </Link>
          }
          description={
            isApiError(error) ? error.message : 'Something went wrong while loading quiz questions.'
          }
          title="Unable to load quiz"
        />
      </QuizStatusLayout>
    );
  }

  if (!questions || questions.length === 0 || !currentQuestion) {
    return (
      <QuizStatusLayout backTo={backTo} title={pageTitle}>
        <EmptyState
          action={
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-stack-md py-2 text-label-md font-semibold text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
              to={backTo}
            >
              Back to lesson
            </Link>
          }
          description="This lesson does not have quiz questions yet. Return to the lesson and try again later."
          title="No quiz questions"
        />
      </QuizStatusLayout>
    );
  }

  return (
    <QuizShell
      backTo={backTo}
      currentQuestionNumber={currentQuestionNumber}
      hasSelection={hasSelection}
      isLastQuestion={isLastQuestion}
      isSubmitting={isSubmitting}
      onContinue={handleContinue}
      title={pageTitle}
      totalQuestions={totalQuestions}
    >
      <QuestionRenderer question={currentQuestion} questionNumber={currentQuestionNumber} />
    </QuizShell>
  );
}

export function QuizPage() {
  const { lessonId: lessonIdParam } = useParams<{ lessonId: string }>();
  const lessonId = parseLessonId(lessonIdParam);

  if (lessonId === undefined) {
    return (
      <QuizStatusLayout backTo="/learn" title="Quiz">
        <EmptyState
          action={
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-stack-md py-2 text-label-md font-semibold text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
              to="/learn"
            >
              Back to roadmap
            </Link>
          }
          description="The lesson in this link is not valid. Return to the roadmap and choose a lesson again."
          title="Lesson not found"
        />
      </QuizStatusLayout>
    );
  }

  return <QuizSessionView lessonId={lessonId} />;
}
