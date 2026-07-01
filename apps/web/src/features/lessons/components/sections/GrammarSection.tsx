import { Text } from '@/components/typography';
import { Card } from '@/components/ui/Card';

import type { GrammarPoint } from '../../api/lessons.schemas';
import { ChineseLine } from '../ChineseLine';
import { SectionHeading } from './SectionHeading';

type GrammarSectionProps = {
  points: GrammarPoint[];
};

const headingId = 'lesson-grammar-heading';

function BookIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-primary"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3h11A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A2.5 2.5 0 0 1 5 18.5v-13Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M5 7.5h12.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function GrammarSection({ points }: GrammarSectionProps) {
  return (
    <section aria-labelledby={headingId}>
      <SectionHeading id={headingId} title="Grammar focus" />
      <ul className="m-0 flex list-none flex-col gap-stack-md p-0">
        {points.map((point) => (
          <li key={point.title}>
            <Card className="border-l-4 border-l-primary bg-surface-container-lowest">
              <div className="mb-2 flex items-center gap-2">
                <BookIcon />
                <h4 className="m-0 text-label-md font-semibold text-on-surface">{point.title}</h4>
              </div>
              <Text as="p" className="m-0 text-on-surface-variant" variant="body">
                {point.explanation}
              </Text>
              {point.examples.length > 0 ? (
                <div className="mt-stack-md">
                  <Text
                    as="p"
                    className="m-0 mb-stack-sm font-semibold uppercase tracking-wide text-primary"
                    variant="label"
                  >
                    Examples
                  </Text>
                  <ul className="m-0 flex list-none flex-col gap-stack-sm p-0">
                    {point.examples.map((example, index) => (
                      <li
                        className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-3"
                        key={`${example.hanzi}-${index}`}
                      >
                        <ChineseLine line={example} showMeaning />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export type { GrammarSectionProps };
