import { Link, useParams } from 'react-router-dom';

import { TopAppBar } from '@/components/navigation/TopAppBar';
import { getButtonClassName } from '@/components/ui/Button/button.styles';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { isApiError } from '@/services';

import { LessonContent } from '../components/LessonContent';
import { LessonHeader } from '../components/LessonHeader';
import { useLesson } from '../hooks/useLesson';

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

function LessonDetailSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="mt-stack-md" role="status">
      <span className="sr-only">Loading lesson</span>
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-stack-sm h-8 w-4/5" />
      <div className="mt-stack-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-card-padding">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </div>
      <Skeleton className="mt-stack-lg h-40 w-full rounded-xl" />
    </div>
  );
}

type LessonDetailViewProps = {
  lessonId: number;
};

function LessonDetailView({ lessonId }: LessonDetailViewProps) {
  const { data: lesson, error, isError, isLoading } = useLesson({ lessonId });
  const pageTitle = lesson?.title ?? 'Lesson';
  const backTo = lesson ? `/learn/${lesson.hsk_level_id}/lessons` : '/learn';

  return (
    <>
      <TopAppBar backTo={backTo} title={pageTitle} />
      <main
        className="mx-auto w-full max-w-lg px-margin-mobile pb-[calc(88px+env(safe-area-inset-bottom,0px))] pt-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        {isLoading ? <LessonDetailSkeleton /> : null}

        {isError ? (
          <EmptyState
            action={
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-stack-md py-2 text-label-md font-semibold text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
                to="/learn"
              >
                Back to roadmap
              </Link>
            }
            description={
              isApiError(error) ? error.message : 'Something went wrong while loading this lesson.'
            }
            title="Unable to load lesson"
          />
        ) : null}

        {!isLoading && !isError && !lesson ? (
          <EmptyState
            action={
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-stack-md py-2 text-label-md font-semibold text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
                to="/learn"
              >
                Back to roadmap
              </Link>
            }
            description="This lesson could not be found. Return to the roadmap and choose another lesson."
            title="Lesson not found"
          />
        ) : null}

        {lesson ? (
          <>
            <LessonHeader lesson={lesson} />
            <LessonContent content={lesson.content} lessonType={lesson.lesson_type} />
          </>
        ) : null}
      </main>
      {lesson ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-outline-variant/40 bg-background/90 px-margin-mobile py-stack-md backdrop-blur-md">
          <Link
            className={getButtonClassName({ variant: 'primary', fullWidth: true })}
            to={`/lessons/${lesson.id}/quiz`}
          >
            Start Quiz
          </Link>
        </div>
      ) : null}
    </>
  );
}

export function LessonDetailPage() {
  const { lessonId: lessonIdParam } = useParams<{ lessonId: string }>();
  const lessonId = parseLessonId(lessonIdParam);

  if (lessonId === undefined) {
    return (
      <>
        <TopAppBar backTo="/learn" title="Lesson" />
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

  return <LessonDetailView lessonId={lessonId} />;
}
