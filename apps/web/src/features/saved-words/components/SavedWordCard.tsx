import { memo } from 'react';

import { Text } from '@/components/typography';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';
import { formatRelativeDate } from '@/utils/format';

import type { SavedWord } from '../api/savedWords.schemas';

type SavedWordCardProps = {
  word: SavedWord;
  className?: string;
};

export const SavedWordCard = memo(function SavedWordCard({ word, className }: SavedWordCardProps) {
  const savedLabel = formatRelativeDate(word.saved_at, { prefix: 'Added ' });

  return (
    <Card className={cn('flex flex-col gap-stack-md', className)} variant="interactive">
      <div className="flex items-start justify-between gap-stack-md">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {word.hsk_level != null ? <Badge variant="tertiary">HSK {word.hsk_level}</Badge> : null}
            <Text as="span" className="text-outline" variant="label">
              {savedLabel}
            </Text>
          </div>
          <h3 className="m-0 font-chinese text-display-zh text-on-surface" lang="zh-Hans">
            {word.hanzi}
          </h3>
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
});

export type { SavedWordCardProps };
