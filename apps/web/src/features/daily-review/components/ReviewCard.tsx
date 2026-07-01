import { memo } from 'react';

import { Text } from '@/components/typography';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getLessonTypeLabel } from '@/features/lessons/constants/lessonTypeLabels';
import { cn } from '@/utils';
import { formatScorePercent } from '@/utils/format';

import type { ReviewItem } from '../types';

type ReviewCardProps = {
  item: ReviewItem;
  className?: string;
};

function formatLastScore(scorePercent: number | null): string {
  if (scorePercent === null) {
    return 'Last score unavailable';
  }
  return `Last score: ${formatScorePercent(scorePercent)}`;
}

export const ReviewCard = memo(function ReviewCard({ item, className }: ReviewCardProps) {
  const reviewHref = `/lessons/${item.id}`;
  const scoreLabel = formatLastScore(item.score_percent);

  return (
    <Card className={cn('flex flex-col gap-stack-md', className)} variant="interactive">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{getLessonTypeLabel(item.lesson_type)}</Badge>
          <Text as="span" className="text-on-surface-variant" variant="label">
            {item.duration_minutes} min
          </Text>
        </div>
        <h3 className="m-0 text-headline-md text-on-surface">{item.title}</h3>
        <Text as="p" className="m-0 mt-1 text-on-surface-variant" variant="label">
          {scoreLabel}
        </Text>
      </div>

      <ButtonLink className="w-fit" to={reviewHref} variant="secondary">
        Review
      </ButtonLink>
    </Card>
  );
});

export type { ReviewCardProps };
