import { Link, useParams } from 'react-router-dom';

import { TopAppBar } from '@/components/navigation/TopAppBar';
import { getButtonClassName } from '@/components/ui/Button/button.styles';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/utils';

import { getMockTestById } from '../types';

function parseMockTestId(rawTestId: string | undefined): number | null {
  if (!rawTestId) {
    return null;
  }

  const testId = Number.parseInt(rawTestId, 10);
  if (!Number.isFinite(testId) || testId <= 0) {
    return null;
  }

  return testId;
}

export function MockTestSessionPage() {
  const { testId: rawTestId } = useParams<{ testId: string }>();
  const testId = parseMockTestId(rawTestId);
  const test = testId === null ? undefined : getMockTestById(testId);

  if (!test) {
    return (
      <>
        <TopAppBar backTo="/profile/mock-tests" title="Mock Test" />
        <main
          className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
          id="main-content"
          tabIndex={-1}
        >
          <EmptyState
            action={
              <Link
                className={cn(
                  getButtonClassName({ variant: 'primary' }),
                  'no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]',
                )}
                to="/profile/mock-tests"
              >
                Back to mock tests
              </Link>
            }
            description="This mock test could not be found. Return to the catalog and choose another exam."
            title="Mock test not found"
          />
        </main>
      </>
    );
  }

  return (
    <>
      <TopAppBar backTo="/profile/mock-tests" title={test.title} />
      <main
        className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <Card className="bg-surface-container-low">
          <h2 className="m-0 text-headline-md text-on-surface">Mock exam session</h2>
          <p className="m-0 mt-stack-sm text-body-md text-on-surface-variant">
            HSK {test.hsk_level} · {test.duration_minutes} minutes · {test.question_count} questions
          </p>
          <p className="m-0 mt-stack-md text-body-md text-on-surface-variant">
            The timed mock exam player will connect here. For now, continue studying lessons for
            this level to prepare.
          </p>
          <Link
            className={cn(
              getButtonClassName({ variant: 'secondary' }),
              'mt-stack-md inline-flex no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]',
            )}
            to={`/learn/${test.id}/lessons`}
          >
            Study HSK {test.hsk_level} lessons
          </Link>
        </Card>
      </main>
    </>
  );
}
