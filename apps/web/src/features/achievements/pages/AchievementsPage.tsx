import { useId } from 'react';

import { FeaturePageShell } from '@/components/layout/FeaturePageShell';
import { QueryContent } from '@/components/layout/QueryContent';
import { StaggerItem, StaggerList } from '@/components/layout/StaggerList';
import {
  AchievementCardSkeleton,
  AchievementsHeroSkeleton,
} from '@/components/skeletons/FeatureSkeletons';
import { Text } from '@/components/typography';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMockQuery } from '@/hooks/useMockQuery';

import { AchievementCard } from '../components/AchievementCard';
import type { Achievement } from '../types';

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    code: 'streak_7',
    title: '7-Day Streak',
    description: 'Study seven days in a row.',
    icon: 'local_fire_department',
    earned: true,
    earned_at: '2025-10-24T12:00:00.000Z',
    featured: true,
  },
  {
    id: 2,
    code: 'hsk_1_master',
    title: 'HSK 1 Master',
    description: 'Complete every HSK 1 lesson.',
    icon: 'school',
    earned: true,
    earned_at: '2025-09-12T12:00:00.000Z',
  },
  {
    id: 3,
    code: 'vocabulary_pro',
    title: 'Vocabulary Pro',
    description: 'Save 500 words to your list.',
    icon: 'menu_book',
    earned: true,
    earned_at: '2025-10-05T12:00:00.000Z',
  },
  {
    id: 4,
    code: 'mock_test_warrior',
    title: 'Mock Test Warrior',
    description: 'Finish your first mock test.',
    icon: 'history_edu',
    earned: true,
    earned_at: '2025-10-20T12:00:00.000Z',
  },
  {
    id: 5,
    code: 'hsk_2_master',
    title: 'HSK 2 Master',
    description: 'Complete every HSK 2 lesson.',
    icon: 'school',
    earned: false,
    earned_at: null,
  },
  {
    id: 6,
    code: 'streak_30',
    title: '30-Day Streak',
    description: 'Study thirty days in a row.',
    icon: 'military_tech',
    earned: false,
    earned_at: null,
  },
];

function getRankTitle(earnedCount: number, totalCount: number): string {
  if (earnedCount === 0) {
    return 'Getting Started';
  }
  if (earnedCount < totalCount / 2) {
    return 'Rising Scholar';
  }
  if (earnedCount < totalCount) {
    return 'Language Elite';
  }
  return 'Master of Mandarin';
}

function TrophyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-12 w-12 text-on-secondary-fixed"
      fill="currentColor"
      height="48"
      viewBox="0 0 24 24"
      width="48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2ZM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8Zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1Z" />
    </svg>
  );
}

function AchievementsSkeleton() {
  return (
    <>
      <AchievementsHeroSkeleton />
      <div className="grid grid-cols-1 gap-stack-md sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <AchievementCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}

export function AchievementsPage() {
  const summaryHeadingId = useId();
  const listHeadingId = useId();
  const query = useMockQuery(MOCK_ACHIEVEMENTS);

  return (
    <FeaturePageShell backTo="/profile" title="Achievements">
      <QueryContent
        data={query.data}
        empty={
          <EmptyState
            description="Complete lessons and reach milestones to earn badges."
            icon="achievements"
            title="No achievements yet"
          />
        }
        errorMessage="We could not load your achievements. Please try again."
        isEmpty={(items) => items.length === 0}
        isError={query.isError}
        isLoading={query.isLoading}
        loading={<AchievementsSkeleton />}
        onRetry={query.refetch}
      >
        {(achievements) => {
          const earnedCount = achievements.filter((achievement) => achievement.earned).length;
          const rankTitle = getRankTitle(earnedCount, achievements.length);

          return (
            <>
              <section
                aria-labelledby={summaryHeadingId}
                className="mb-stack-lg flex flex-col items-center text-center"
              >
                <div
                  aria-hidden="true"
                  className="mb-stack-md flex h-24 w-24 items-center justify-center rounded-full bg-secondary-fixed shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105"
                >
                  <TrophyIcon />
                </div>
                <h2
                  className="m-0 text-headline-lg-mobile text-on-surface sm:text-headline-lg"
                  id={summaryHeadingId}
                >
                  {rankTitle}
                </h2>
                <Text as="p" className="m-0 mt-stack-sm text-on-surface-variant" variant="label">
                  You&apos;ve unlocked {earnedCount} of {achievements.length} achievements.
                </Text>
              </section>

              <section aria-labelledby={listHeadingId}>
                <h2 className="sr-only" id={listHeadingId}>
                  Achievement list
                </h2>
                <StaggerList className="grid grid-cols-1 gap-stack-md sm:grid-cols-2">
                  {achievements.map((achievement, index) => (
                    <StaggerItem className="min-h-[11rem]" index={index} key={achievement.id}>
                      <AchievementCard
                        achievement={achievement}
                        className="h-full"
                        variant={achievement.featured ? 'featured' : 'default'}
                      />
                    </StaggerItem>
                  ))}
                </StaggerList>
              </section>
            </>
          );
        }}
      </QueryContent>
    </FeaturePageShell>
  );
}
