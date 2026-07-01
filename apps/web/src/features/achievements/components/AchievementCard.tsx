import type { ReactNode } from 'react';
import { memo } from 'react';

import { Text } from '@/components/typography';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';
import { formatDate } from '@/utils/format';

import type { Achievement, AchievementCardVariant, AchievementIconKey } from '../types';

type AchievementCardProps = {
  achievement: Achievement;
  variant?: AchievementCardVariant;
  className?: string;
};

const achievementIcons: Record<AchievementIconKey, ReactNode> = {
  local_fire_department: (
    <path
      d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67ZM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8Z"
      fill="currentColor"
    />
  ),
  school: (
    <path
      d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82ZM12 3 1 9l11 6 9-4.91V17h2V9L12 3Z"
      fill="currentColor"
    />
  ),
  menu_book: (
    <path
      d="M18 2H6a2 2 0 0 0-2 2v16l8-3 8 3V4a2 2 0 0 0-2-2Zm0 15.17-6-2.25-6 2.25V4h12v13.17Z"
      fill="currentColor"
    />
  ),
  history_edu: (
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16h12V4a2 2 0 0 0-2-2Zm-2 14H8v-2h4v2Zm0-4H8v-2h4v2Zm4 4h-2v-2h2v2Zm0-4h-2v-2h2v2ZM20 7v14H6v2h14a2 2 0 0 0 2-2V7h-2Z"
      fill="currentColor"
    />
  ),
  military_tech: (
    <path
      d="m12 2 2.4 4.86 5.37.78-3.89 3.79.92 5.35L12 14.77l-4.8 2.52.92-5.35L4.23 7.64l5.37-.78L12 2Z"
      fill="currentColor"
    />
  ),
  workspace_premium: (
    <path
      d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"
      fill="currentColor"
    />
  ),
  emoji_events: (
    <path
      d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2ZM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8Zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1Z"
      fill="currentColor"
    />
  ),
};

function LockIcon() {
  return (
    <path
      d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0v2H9V6Zm9 14H6V10h12v10Z"
      fill="currentColor"
    />
  );
}

function AchievementIcon({
  earned,
  iconKey,
  featured,
}: {
  earned: boolean;
  iconKey: AchievementIconKey | null;
  featured: boolean;
}) {
  const icon = !earned ? (
    <LockIcon />
  ) : (
    (achievementIcons[iconKey ?? 'emoji_events'] ?? achievementIcons.emoji_events)
  );

  return (
    <div
      className={cn(
        'flex h-16 w-16 items-center justify-center rounded-full',
        earned
          ? featured
            ? 'bg-secondary-fixed text-on-secondary-fixed'
            : 'bg-surface-container text-primary'
          : 'bg-surface-dim text-outline',
      )}
    >
      <svg
        aria-hidden="true"
        className="h-8 w-8"
        fill="none"
        height="32"
        viewBox="0 0 24 24"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        {icon}
      </svg>
    </div>
  );
}

function formatEarnedDate(isoDate: string): string {
  return formatDate(isoDate, { month: 'short', day: 'numeric' });
}

export const AchievementCard = memo(function AchievementCard({
  achievement,
  variant = 'default',
  className,
}: AchievementCardProps) {
  const isEarned = achievement.earned;
  const isFeatured = isEarned && variant === 'featured';
  const statusLabel = isEarned
    ? achievement.earned_at
      ? `Earned ${formatEarnedDate(achievement.earned_at)}`
      : 'Earned'
    : 'Locked';

  return (
    <Card
      className={cn(
        'relative flex h-full flex-col items-center overflow-hidden text-center transition-[transform,box-shadow] duration-200',
        isEarned
          ? 'border-transparent bg-surface-container-lowest motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-elevated'
          : 'border-transparent bg-surface-container-low opacity-60 grayscale',
        isFeatured && 'border-2 border-secondary-fixed shadow-card',
        className,
      )}
      variant={isEarned ? 'interactive' : 'default'}
    >
      {isFeatured ? (
        <span aria-hidden="true" className="absolute right-2 top-2 text-secondary-fixed">
          <svg
            className="h-[18px] w-[18px]"
            fill="currentColor"
            height="18"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m12 2 2.4 4.86 5.37.78-3.89 3.79.92 5.35L12 14.77l-4.8 2.52.92-5.35L4.23 7.64l5.37-.78L12 2Z" />
          </svg>
        </span>
      ) : null}

      <AchievementIcon earned={isEarned} featured={isFeatured} iconKey={achievement.icon} />

      <h3
        className={cn(
          'm-0 mt-stack-sm text-label-md font-semibold leading-tight',
          isEarned ? 'text-on-surface' : 'text-on-surface-variant',
        )}
      >
        {achievement.title}
      </h3>

      {achievement.description ? (
        <Text
          as="p"
          className={cn(
            'm-0 mt-1 line-clamp-2',
            isEarned ? 'text-on-surface-variant' : 'text-outline',
          )}
          variant="label"
        >
          {achievement.description}
        </Text>
      ) : null}

      <Text
        as="p"
        className={cn('m-0 mt-1', isEarned ? 'text-on-surface-variant' : 'text-outline')}
        variant="label"
      >
        {statusLabel}
      </Text>
    </Card>
  );
});

export type { AchievementCardProps };
