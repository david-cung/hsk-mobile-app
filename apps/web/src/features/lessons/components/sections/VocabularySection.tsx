import { ChineseText, Text } from '@/components/typography';
import { Card } from '@/components/ui/Card';

import type { ChineseEntry } from '../../api/lessons.schemas';
import { SectionHeading } from './SectionHeading';

type VocabularySectionProps = {
  items: ChineseEntry[];
};

const headingId = 'lesson-vocabulary-heading';

export function VocabularySection({ items }: VocabularySectionProps) {
  const wordCountLabel = items.length === 1 ? '1 word' : `${items.length} words`;

  return (
    <section aria-labelledby={headingId}>
      <SectionHeading id={headingId} meta={wordCountLabel} title="Vocabulary" />
      <ul className="-mx-margin-mobile flex list-none gap-stack-md overflow-x-auto px-margin-mobile pb-2 snap-x snap-mandatory">
        {items.map((word) => (
          <li className="w-32 shrink-0 snap-start" key={word.hanzi}>
            <Card className="h-full bg-surface-container-lowest p-stack-md text-center">
              <ChineseText as="p" className="m-0 mb-1 text-primary" variant="display">
                {word.hanzi}
              </ChineseText>
              {word.pinyin ? (
                <Text as="p" className="m-0 text-on-surface-variant" variant="label">
                  {word.pinyin}
                </Text>
              ) : null}
              {word.meaning ? (
                <Text as="p" className="m-0 mt-1 text-outline" variant="label">
                  {word.meaning}
                </Text>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export type { VocabularySectionProps };
