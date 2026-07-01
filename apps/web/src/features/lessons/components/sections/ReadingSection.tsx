import { Text } from '@/components/typography';
import { Card } from '@/components/ui/Card';

import type { LessonContent } from '../../api/lessons.schemas';
import { ChineseLine } from '../ChineseLine';
import { SectionHeading } from './SectionHeading';

type ReadingSectionProps = {
  content: Pick<LessonContent, 'passage' | 'passage_title' | 'vocabulary'>;
};

const headingId = 'lesson-reading-heading';
const keyWordsHeadingId = 'lesson-reading-key-words-heading';

export function ReadingSection({ content }: ReadingSectionProps) {
  const passage = content.passage ?? [];
  const keyWords = content.vocabulary ?? [];

  if (passage.length === 0) {
    return (
      <section aria-labelledby={headingId}>
        <SectionHeading id={headingId} title="Reading" />
        <Text as="p" className="m-0 text-on-surface-variant" variant="body">
          This reading lesson does not include a passage yet.
        </Text>
      </section>
    );
  }

  return (
    <section aria-labelledby={headingId}>
      <SectionHeading id={headingId} title="Reading" />
      {content.passage_title ? (
        <Text
          as="p"
          className="m-0 mb-stack-md text-center font-semibold text-on-surface"
          variant="label"
        >
          {content.passage_title}
        </Text>
      ) : null}
      <Card className="bg-surface-container-lowest">
        <Text as="p" className="m-0 mb-stack-md text-on-surface-variant" variant="label">
          Read aloud
        </Text>
        <ul className="m-0 flex list-none flex-col gap-stack-sm p-0">
          {passage.map((line, index) => (
            <li key={`${line.hanzi}-${index}`}>
              <ChineseLine line={line} />
            </li>
          ))}
        </ul>
      </Card>
      {keyWords.length > 0 ? (
        <section aria-labelledby={keyWordsHeadingId} className="mt-stack-lg">
          <SectionHeading id={keyWordsHeadingId} title="Key words" />
          <ul className="m-0 flex list-none flex-col gap-stack-md p-0">
            {keyWords.map((word) => (
              <li key={word.hanzi}>
                <Card className="bg-surface-container-lowest">
                  <ChineseLine line={word} />
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}

export type { ReadingSectionProps };
