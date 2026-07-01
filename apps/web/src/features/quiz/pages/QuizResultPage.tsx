import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import { TopAppBar } from '@/components/navigation/TopAppBar';
import { Text } from '@/components/typography';
import { Button } from '@/components/ui/Button';
import { getButtonClassName } from '@/components/ui/Button/button.styles';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLesson } from '@/features/lessons/hooks/useLesson';

import {
  type QuizResultItem,
  type QuizSubmitResult,
  QuizSubmitResultSchema,
} from '../api/quiz.schemas';
import { ResultStats } from '../components/ResultStats';
import { ScoreRing } from '../components/ScoreRing';

/**
 * Quiz results are passed via React Router location state when navigating from
 * `QuizPage` after a successful submit (`{ lessonTitle?, result }`).
 */
type QuizResultLocationState = {
  lessonTitle?: string;
  result: QuizSubmitResult;
  elapsedMs?: number;
};

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

function parseQuizResultLocationState(state: unknown): QuizResultLocationState | null {
  if (!state || typeof state !== 'object') {
    return null;
  }

  const record = state as Record<string, unknown>;
  const result = QuizSubmitResultSchema.safeParse(record.result);

  if (!result.success) {
    return null;
  }

  return {
    lessonTitle: typeof record.lessonTitle === 'string' ? record.lessonTitle : undefined,
    result: result.data,
    elapsedMs: typeof record.elapsedMs === 'number' ? record.elapsedMs : undefined,
  };
}

function getResultHeadline(score: number): { title: string; description: string } {
  if (score >= 90) {
    return {
      title: 'Excellent work!',
      description: 'You have mastered most of the concepts in this lesson.',
    };
  }

  if (score >= 70) {
    return {
      title: 'Great job!',
      description: 'You passed this quiz. Keep building on this momentum.',
    };
  }

  return {
    title: 'Keep practicing!',
    description: 'Review the lesson materials and try the quiz again when you are ready.',
  };
}

type MistakesReviewProps = {
  mistakes: QuizResultItem[];
};

function MistakesReview({ mistakes }: MistakesReviewProps) {
  if (mistakes.length === 0) {
    return (
      <Card className="bg-surface-container-low">
        <Text as="p" className="m-0 text-on-surface-variant" variant="body">
          You answered every question correctly. No mistakes to review.
        </Text>
      </Card>
    );
  }

  return (
    <Card aria-labelledby="quiz-mistakes-heading" className="bg-surface-container-lowest">
      <h3 className="m-0 mb-stack-md text-headline-md text-on-surface" id="quiz-mistakes-heading">
        Questions to review
      </h3>
      <ul className="m-0 flex list-none flex-col gap-stack-md p-0">
        {mistakes.map((mistake) => (
          <li
            className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-stack-md"
            key={mistake.question_id}
          >
            <Text as="p" className="m-0 font-semibold text-on-surface" variant="label">
              Your answer: {mistake.user_answer || 'No answer'}
            </Text>
            <Text as="p" className="m-0 mt-1 text-on-surface-variant" variant="body">
              Correct answer: {mistake.correct_answer}
            </Text>
            {mistake.explanation ? (
              <Text as="p" className="m-0 mt-2 text-on-surface-variant" variant="body">
                {mistake.explanation}
              </Text>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

type QuizResultViewProps = {
  lessonId: number;
  locationState: QuizResultLocationState;
};

function QuizResultView({ lessonId, locationState }: QuizResultViewProps) {
  const [showMistakes, setShowMistakes] = useState(false);
  const { data: lesson } = useLesson({ lessonId });

  const { lessonTitle, result, elapsedMs } = locationState;
  const pageTitle = lessonTitle ?? lesson?.title ?? 'Quiz results';
  const continueTo = lesson ? `/learn/${lesson.hsk_level_id}/lessons` : '/learn';
  const tryAgainTo = `/lessons/${lessonId}/quiz`;
  const wrongCount = result.total_questions - result.correct_count;
  const mistakes = result.results.filter((item) => !item.correct);
  const headline = getResultHeadline(result.score);

  return (
    <>
      <TopAppBar backLabel="Back to lesson" backTo={`/lessons/${lessonId}`} title={pageTitle} />
      <main
        className="mx-auto flex w-full max-w-lg flex-col px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <Card className="mb-stack-md flex flex-col items-center bg-surface-container-lowest text-center">
          <ScoreRing className="mb-stack-md" score={result.score} />
          <h2 className="m-0 text-headline-lg-mobile text-on-surface">{headline.title}</h2>
          <Text as="p" className="m-0 mt-1 text-on-surface-variant" variant="body">
            {headline.description}
          </Text>
        </Card>

        <div className="mb-stack-md">
          <ResultStats
            correctCount={result.correct_count}
            elapsedMs={elapsedMs}
            wrongCount={wrongCount}
          />
        </div>

        {showMistakes ? (
          <div className="mb-stack-lg">
            <MistakesReview mistakes={mistakes} />
          </div>
        ) : null}

        <div className="flex flex-col gap-stack-sm">
          <Link
            className={getButtonClassName({ variant: 'primary', fullWidth: true })}
            to={continueTo}
          >
            Continue learning
          </Link>
          <div className="grid grid-cols-1 gap-stack-sm sm:grid-cols-2">
            <Button
              fullWidth
              onClick={() => {
                setShowMistakes((current) => !current);
              }}
              type="button"
              variant="secondary"
            >
              {showMistakes ? 'Hide mistakes' : 'Review mistakes'}
            </Button>
            <Link
              className={getButtonClassName({ variant: 'ghost', fullWidth: true })}
              to={tryAgainTo}
            >
              Try again
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export function QuizResultPage() {
  const { lessonId: lessonIdParam } = useParams<{ lessonId: string }>();
  const location = useLocation();
  const lessonId = parseLessonId(lessonIdParam);
  const locationState = parseQuizResultLocationState(location.state);

  if (lessonId === undefined) {
    return (
      <>
        <TopAppBar backTo="/learn" title="Quiz results" />
        <main
          className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
          id="main-content"
          tabIndex={-1}
        >
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
        </main>
      </>
    );
  }

  if (!locationState) {
    return (
      <>
        <TopAppBar backTo={`/lessons/${lessonId}`} title="Quiz results" />
        <main
          className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
          id="main-content"
          tabIndex={-1}
        >
          <EmptyState
            action={
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-stack-md py-2 text-label-md font-semibold text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
                to={`/lessons/${lessonId}/quiz`}
              >
                Take the quiz
              </Link>
            }
            description="Quiz results are shown right after you submit a quiz. Start or retake the lesson quiz to see your score."
            title="No results available"
          />
        </main>
      </>
    );
  }

  return <QuizResultView lessonId={lessonId} locationState={locationState} />;
}
