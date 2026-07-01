import { useId } from 'react';

import { TopAppBar } from '@/components/navigation/TopAppBar';
import { EmptyState } from '@/components/ui/EmptyState';

import { ReviewCard, type ReviewItem } from '../components/ReviewCard';

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

export function DailyReviewPage() {
  const queueHeadingId = useId();
  const reviewQueue = MOCK_REVIEW_QUEUE;

  return (
    <>
      <TopAppBar backTo="/profile" title="Daily Review" />
      <main
        className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <p className="m-0 mb-stack-lg text-body-md text-on-surface-variant">
          Revisit words and lessons you have studied
        </p>

        {reviewQueue.length === 0 ? (
          <EmptyState
            description="Complete a lesson quiz first, then come back for spaced repetition practice."
            title="No lessons to review yet"
          />
        ) : (
          <section aria-labelledby={queueHeadingId}>
            <h2 className="m-0 mb-stack-md text-headline-md text-on-surface" id={queueHeadingId}>
              Today&apos;s queue
              <span className="sr-only"> ({reviewQueue.length} lessons)</span>
            </h2>
            <ul className="m-0 flex list-none flex-col gap-stack-md p-0">
              {reviewQueue.map((item) => (
                <li key={item.id}>
                  <ReviewCard item={item} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
