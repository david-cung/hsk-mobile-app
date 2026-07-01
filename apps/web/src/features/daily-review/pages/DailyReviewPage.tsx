import { useId } from 'react';

import { FeaturePageShell } from '@/components/layout/FeaturePageShell';
import { QueryContent } from '@/components/layout/QueryContent';
import { StaggerItem, StaggerList } from '@/components/layout/StaggerList';
import { ReviewCardSkeleton } from '@/components/skeletons/FeatureSkeletons';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMockQuery } from '@/hooks/useMockQuery';

import { ReviewCard } from '../components/ReviewCard';
import type { ReviewItem } from '../types';

const MOCK_REVIEW_QUEUE: ReviewItem[] = [
  {
    id: 1,
    title: 'Greetings & Introductions',
    lesson_type: 'vocabulary',
    score_percent: 92,
    duration_minutes: 10,
  },
  {
    id: 2,
    title: 'Basic Sentence Patterns',
    lesson_type: 'grammar',
    score_percent: 85,
    duration_minutes: 15,
  },
  {
    id: 3,
    title: 'Listening: At the Café',
    lesson_type: 'listening',
    score_percent: 78,
    duration_minutes: 12,
  },
];

function DailyReviewSkeleton() {
  return (
    <div className="flex flex-col gap-stack-md">
      <ReviewCardSkeleton />
      <ReviewCardSkeleton />
      <ReviewCardSkeleton />
    </div>
  );
}

export function DailyReviewPage() {
  const queueHeadingId = useId();
  const query = useMockQuery(MOCK_REVIEW_QUEUE);

  return (
    <FeaturePageShell backTo="/profile" title="Daily Review">
      <p className="m-0 mb-stack-lg text-body-md text-on-surface-variant sm:text-body-lg">
        Revisit words and lessons you have studied
      </p>

      <QueryContent
        data={query.data}
        empty={
          <EmptyState
            description="Complete a lesson quiz first, then come back for spaced repetition practice."
            icon="review"
            title="No lessons to review yet"
          />
        }
        errorMessage="We could not load your review queue. Please try again."
        isEmpty={(items) => items.length === 0}
        isError={query.isError}
        isLoading={query.isLoading}
        loading={<DailyReviewSkeleton />}
        onRetry={query.refetch}
      >
        {(reviewQueue) => (
          <section aria-labelledby={queueHeadingId}>
            <h2 className="m-0 mb-stack-md text-headline-md text-on-surface" id={queueHeadingId}>
              Today&apos;s queue
              <span className="sr-only"> ({reviewQueue.length} lessons)</span>
            </h2>
            <StaggerList className="flex flex-col gap-stack-md">
              {reviewQueue.map((item, index) => (
                <StaggerItem index={index} key={item.id}>
                  <ReviewCard item={item} />
                </StaggerItem>
              ))}
            </StaggerList>
          </section>
        )}
      </QueryContent>
    </FeaturePageShell>
  );
}
