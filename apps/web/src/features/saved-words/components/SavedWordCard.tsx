import { ChineseText, Text } from '@/components/typography';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

import type { SavedWord } from '../api/savedWords.schemas';

type SavedWordCardProps = {
  word: SavedWord;
  className?: string;
};

function formatSavedAt(isoDate: string): string {
  const saved = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - saved.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'Added today';
  }
  if (diffDays === 1) {
    return 'Added yesterday';
  }
  if (diffDays < 7) {
    return `Added ${diffDays} days ago`;
  }
  if (diffDays < 14) {
    return 'Added 1 week ago';
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Added ${weeks} weeks ago`;
  }

  return `Added ${saved.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

export function SavedWordCard({ word, className }: SavedWordCardProps) {
  const savedLabel = formatSavedAt(word.saved_at);

  return (
    <Card
      className={cn(
        'flex flex-col gap-stack-md border-transparent transition-colors hover:border-primary-fixed',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-stack-md">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {word.hsk_level != null ? <Badge variant="tertiary">HSK {word.hsk_level}</Badge> : null}
            <Text as="span" className="text-outline" variant="label">
              {savedLabel}
            </Text>
          </div>
          <ChineseText as="h2" className="m-0 text-on-surface" variant="display">
            {word.hanzi}
          </ChineseText>
          {word.pinyin ? (
            <Text as="p" className="m-0 mt-1 font-medium text-primary" variant="body">
              {word.pinyin}
            </Text>
          ) : null}
        </div>
      </div>
      {word.meaning ? (
        <div className="border-t border-surface-container pt-stack-sm">
          <Text as="p" className="m-0 text-on-surface-variant" variant="body">
            {word.meaning}
          </Text>
        </div>
      ) : null}
    </Card>
  );
}

export type { SavedWordCardProps };
