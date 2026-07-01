import { ChineseText, Text } from '@/components/typography';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

import type { LessonContent } from '../../api/lessons.schemas';
import { SectionHeading } from './SectionHeading';

type WritingSectionProps = {
  content: Pick<LessonContent, 'characters' | 'tip'>;
};

const headingId = 'lesson-writing-heading';

export function WritingSection({ content }: WritingSectionProps) {
  const characters = content.characters ?? [];

  if (characters.length === 0) {
    return (
      <section aria-labelledby={headingId}>
        <SectionHeading id={headingId} title="Writing" />
        <Text as="p" className="m-0 text-on-surface-variant" variant="body">
          This writing lesson does not include characters to practice yet.
        </Text>
      </section>
    );
  }

  return (
    <section aria-labelledby={headingId}>
      <SectionHeading id={headingId} title="Writing" />
      {content.tip ? (
        <Text as="p" className="m-0 mb-stack-md italic text-on-surface-variant" variant="body">
          {content.tip}
        </Text>
      ) : null}
      <ul className="m-0 flex list-none flex-col gap-stack-md p-0">
        {characters.map((character) => (
          <li key={character.hanzi}>
            <Card className="bg-surface-container-lowest">
              <div className="flex flex-wrap items-start justify-between gap-stack-md">
                <ChineseText as="p" className="m-0 text-on-surface" variant="display">
                  {character.hanzi}
                </ChineseText>
                {character.strokes != null ? (
                  <Badge variant="tertiary">{character.strokes} strokes</Badge>
                ) : null}
              </div>
              {character.pinyin ? (
                <Text as="p" className="m-0 mt-2 text-on-surface-variant" variant="body">
                  {character.pinyin}
                </Text>
              ) : null}
              {character.meaning ? (
                <Text as="p" className="m-0 mt-1 text-on-surface" variant="body">
                  {character.meaning}
                </Text>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export type { WritingSectionProps };
