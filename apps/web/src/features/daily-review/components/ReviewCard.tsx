import { Link } from 'react-router-dom';

import { Text } from '@/components/typography';
import { Badge } from '@/components/ui/Badge';
import { getButtonClassName } from '@/components/ui/Button/button.styles';
import { Card } from '@/components/ui/Card';
import type { LessonType } from '@/features/lessons/api/lessons.schemas';
import { cn } from '@/utils';

export type ReviewItem = {
  id: number;
  title: string;
  lesson_type: LessonType;
  score_percent: number | null;
  duration_minutes: number;
};

type ReviewCardProps = {
  item: ReviewItem;
  className?: string;
};

const lessonTypeLabels: Record<LessonType, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  mixed: 'Mixed',
};

function formatLastScore(scorePercent: number | null): string {
  if (scorePercent === null) {
    return 'Last score unavailable';
  }
  return `Last score: ${Math.round(scorePercent)}%`;
}

export function ReviewCard({ item, className }: ReviewCardProps) {
  const reviewHref = `/lessons/${item.id}`;
  const scoreLabel = formatLastScore(item.score_percent);

  return (
    <Card className={cn('flex flex-col gap-stack-md', className)}>
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{lessonTypeLabels[item.lesson_type]}</Badge>
          <Text as="span" className="text-on-surface-variant" variant="label">
            {item.duration_minutes} min
          </Text>
        </div>
        <h2 className="m-0 text-headline-md text-on-surface">{item.title}</h2>
        <Text as="p" className="m-0 mt-1 text-on-surface-variant" variant="label">
          {scoreLabel}
        </Text>
      </div>

      <Link
        className={cn(
          getButtonClassName({ variant: 'secondary' }),
          'w-fit no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]',
        )}
        to={reviewHref}
      >
        Review
      </Link>
    </Card>
  );
}

export type { ReviewCardProps };
