import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { isApiError } from '@/services';

import { useLessons } from '../hooks/useLessons';
import { LessonCard } from './LessonCard';

type LessonListProps = {
  levelId: number;
};

function LessonListSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-stack-md" role="status">
      <span className="sr-only">Loading lessons</span>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-card-padding"
          key={index}
        >
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-stack-sm h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-stack-sm h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function LessonList({ levelId }: LessonListProps) {
  const { data: lessons, error, isError, isLoading } = useLessons({ levelId });

  if (isLoading) {
    return <LessonListSkeleton />;
  }

  if (isError) {
    const description = isApiError(error)
      ? error.message
      : 'Something went wrong while loading lessons.';

    return (
      <EmptyState
        action={
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-stack-md py-2 text-label-md font-semibold text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
            to="/learn"
          >
            Back to roadmap
          </Link>
        }
        description={description}
        title="Unable to load lessons"
      />
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <EmptyState
        action={
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-stack-md py-2 text-label-md font-semibold text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
            to="/learn"
          >
            Back to roadmap
          </Link>
        }
        description="Lessons for this level are not available yet. Check back soon or explore another level."
        title="No lessons yet"
      />
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-stack-md p-0">
      {lessons.map((lesson) => (
        <li key={lesson.id}>
          <LessonCard lesson={lesson} />
        </li>
      ))}
    </ul>
  );
}

export type { LessonListProps };
