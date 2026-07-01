import { Text } from '@/components/typography';
import { Card } from '@/components/ui/Card';

import type { LessonContent } from '../../api/lessons.schemas';
import { ChineseLine } from '../ChineseLine';
import { SectionHeading } from './SectionHeading';

type ListeningSectionProps = {
  content: Pick<LessonContent, 'transcript' | 'tip'>;
};

const headingId = 'lesson-listening-heading';

export function ListeningSection({ content }: ListeningSectionProps) {
  const transcript = content.transcript ?? [];

  if (transcript.length === 0) {
    return (
      <section aria-labelledby={headingId}>
        <SectionHeading id={headingId} title="Listening" />
        <Text as="p" className="m-0 text-on-surface-variant" variant="body">
          This listening lesson does not include a transcript yet.
        </Text>
      </section>
    );
  }

  return (
    <section aria-labelledby={headingId}>
      <SectionHeading id={headingId} title="Listening" />
      {content.tip ? (
        <Text as="p" className="m-0 mb-stack-md italic text-on-surface-variant" variant="body">
          {content.tip}
        </Text>
      ) : null}
      <Card className="bg-surface-container-high">
        <Text as="p" className="m-0 mb-stack-md font-semibold text-on-surface" variant="label">
          Conversation transcript
        </Text>
        <ul className="m-0 flex list-none flex-col gap-stack-md p-0">
          {transcript.map((line, index) => (
            <li key={`${line.hanzi}-${index}`}>
              <ChineseLine line={line} />
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

export type { ListeningSectionProps };
