import { ChineseText, Text } from '@/components/typography';
import { cn } from '@/utils';

import type { ChineseEntry } from '../api/lessons.schemas';

type ChineseLineProps = {
  line: ChineseEntry;
  variant?: 'default' | 'large';
  showMeaning?: boolean;
  className?: string;
};

export function ChineseLine({
  line,
  variant = 'default',
  showMeaning = true,
  className,
}: ChineseLineProps) {
  const isLarge = variant === 'large';

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <ChineseText
        as="p"
        className={cn('m-0 text-on-surface', isLarge && 'text-display-zh text-primary')}
        variant={isLarge ? 'display' : 'body'}
      >
        {line.hanzi}
      </ChineseText>
      {line.pinyin ? (
        <Text as="p" className="m-0 text-on-surface-variant" variant="label">
          {line.pinyin}
        </Text>
      ) : null}
      {showMeaning && line.meaning ? (
        <Text as="p" className="m-0 text-on-surface" variant="body">
          {line.meaning}
        </Text>
      ) : null}
    </div>
  );
}

export type { ChineseLineProps };
