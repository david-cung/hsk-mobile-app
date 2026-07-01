import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { getLessonTypeLabel } from '@/features/lessons/constants/lessonTypeLabels';
import { cn } from '@/utils';

import type { LessonListItem, LessonStatus } from '../api/lessons.schemas';

type LessonCardProps = {
  lesson: LessonListItem;
};

const statusBorderStyles: Record<LessonStatus, string> = {
  completed: 'border-l-primary',
  in_progress: 'border-l-secondary',
  not_started: 'border-l-outline-variant',
};

const statusLabels: Record<LessonStatus, string> = {
  completed: 'Completed',
  in_progress: 'In progress',
  not_started: 'Not started',
};

function formatLessonStatus(lesson: LessonListItem): LessonStatus {
  return lesson.status ?? 'not_started';
}

function LessonStatusMeta({ lesson }: { lesson: LessonListItem }) {
  const status = formatLessonStatus(lesson);

  if (status === 'completed' && lesson.score_percent !== null) {
    return (
      <span className="text-label-sm font-semibold text-primary">
        {Math.round(lesson.score_percent)}% {statusLabels.completed}
      </span>
    );
  }

  if (status === 'in_progress') {
    return (
      <span className="text-label-sm font-semibold text-secondary">
        {lesson.score_percent !== null
          ? `${Math.round(lesson.score_percent)}% ${statusLabels.in_progress}`
          : statusLabels.in_progress}
      </span>
    );
  }

  return <span className="text-label-sm text-on-surface-variant">{statusLabels.not_started}</span>;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const status = formatLessonStatus(lesson);

  return (
    <Link
      className="block rounded-xl ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
      to={`/lessons/${lesson.id}`}
    >
      <Card
        className={cn(
          'flex items-center justify-between gap-stack-md border-l-4 transition-colors hover:bg-surface-container-low',
          statusBorderStyles[status],
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{getLessonTypeLabel(lesson.lesson_type)}</Badge>
          </div>
          <h3 className="m-0 text-headline-md text-on-surface">{lesson.title}</h3>
          {lesson.description ? (
            <p className="m-0 mt-1 line-clamp-2 text-body-md text-on-surface-variant">
              {lesson.description}
            </p>
          ) : null}
          <div className="mt-stack-sm flex flex-wrap items-center gap-stack-md text-label-sm text-on-surface-variant">
            <span>{lesson.duration_minutes} min</span>
            <LessonStatusMeta lesson={lesson} />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export type { LessonCardProps };
