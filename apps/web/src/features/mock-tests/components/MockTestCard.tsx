import { Link } from 'react-router-dom';

import { Text } from '@/components/typography';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

import { getMockTestSessionPath, type MockTest } from '../types';

type MockTestCardProps = {
  test: MockTest;
  className?: string;
};

function formatQuestionCount(count: number): string {
  return count === 1 ? '1 question' : `${count} questions`;
}

export function MockTestCard({ test, className }: MockTestCardProps) {
  const sessionHref = getMockTestSessionPath(test.id);

  return (
    <Link
      className={cn(
        'block rounded-xl ring-focus focus-visible:outline-none focus-visible:ring-[3px]',
        'transition-transform motion-safe:active:scale-[0.99] motion-reduce:active:scale-100',
        className,
      )}
      to={sessionHref}
    >
      <Card className="flex flex-col gap-stack-md border-transparent transition-colors hover:border-primary-fixed">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="tertiary">HSK {test.hsk_level}</Badge>
          </div>
          <h2 className="m-0 text-headline-md text-on-surface">{test.title}</h2>
          <div className="mt-stack-sm flex flex-wrap items-center gap-stack-md">
            <Text as="span" className="text-on-surface-variant" variant="label">
              {test.duration_minutes} min
            </Text>
            <Text as="span" className="text-on-surface-variant" variant="label">
              {formatQuestionCount(test.question_count)}
            </Text>
          </div>
        </div>
        <Text as="span" className="font-semibold text-primary" variant="label">
          Start mock test
        </Text>
      </Card>
    </Link>
  );
}

export type { MockTestCardProps };
