import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

import type { LessonDetail, LessonType } from '../api/lessons.schemas';

const lessonTypeLabels: Record<LessonType, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  mixed: 'Mixed',
};

type LessonHeaderProps = {
  lesson: Pick<LessonDetail, 'title' | 'description' | 'lesson_type' | 'duration_minutes'>;
};

export function LessonHeader({ lesson }: LessonHeaderProps) {
  return (
    <header className="mt-stack-md">
      <div className="mb-stack-sm flex flex-wrap items-center gap-2">
        <Badge variant="outline">{lessonTypeLabels[lesson.lesson_type]}</Badge>
        <span className="text-label-sm text-on-surface-variant">{lesson.duration_minutes} min</span>
      </div>
      <h2 className="m-0 text-headline-lg-mobile text-on-surface">{lesson.title}</h2>
      {lesson.description ? (
        <Card className="mt-stack-md bg-surface-container-low shadow-card">
          <p className="m-0 text-label-sm font-semibold uppercase tracking-wide text-primary">
            Learning objective
          </p>
          <p className="m-0 mt-1 text-body-md text-on-surface-variant">{lesson.description}</p>
        </Card>
      ) : null}
    </header>
  );
}

export type { LessonHeaderProps };
