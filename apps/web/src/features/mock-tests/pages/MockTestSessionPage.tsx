import { useParams } from 'react-router-dom';

import { FeaturePageShell } from '@/components/layout/FeaturePageShell';
import { QueryContent } from '@/components/layout/QueryContent';
import { MockTestCardSkeleton } from '@/components/skeletons/FeatureSkeletons';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMockQuery } from '@/hooks/useMockQuery';

import { getMockTestById, type MockTest } from '../types';

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

function SessionSkeleton() {
  return <MockTestCardSkeleton />;
}

export function MockTestSessionPage() {
  const { testId: rawTestId } = useParams<{ testId: string }>();
  const testId = parseMockTestId(rawTestId);
  const sourceTest = testId === null ? undefined : getMockTestById(testId);
  const query = useMockQuery<MockTest | undefined>(sourceTest, { delayMs: 320 });

  if (!sourceTest) {
    return (
      <FeaturePageShell backTo="/profile/mock-tests" title="Mock Test">
        <EmptyState
          action={
            <ButtonLink to="/profile/mock-tests" variant="primary">
              Back to mock tests
            </ButtonLink>
          }
          description="This mock test could not be found. Return to the catalog and choose another exam."
          icon="mock-test"
          title="Mock test not found"
        />
      </FeaturePageShell>
    );
  }

  return (
    <FeaturePageShell backTo="/profile/mock-tests" title={sourceTest.title}>
      <QueryContent
        data={query.data}
        empty={
          <EmptyState
            description="This mock test session is not available right now."
            icon="mock-test"
            title="Session unavailable"
          />
        }
        errorMessage="We could not load this mock test session."
        isEmpty={(test) => test === undefined}
        isError={query.isError}
        isLoading={query.isLoading}
        loading={<SessionSkeleton />}
        onRetry={query.refetch}
      >
        {(test) => (
          <Card className="animate-scale-in bg-surface-container-low" variant="interactive">
            <h2 className="m-0 text-headline-md text-on-surface">Mock exam session</h2>
            <p className="m-0 mt-stack-sm text-body-md text-on-surface-variant">
              HSK {test.hsk_level} · {test.duration_minutes} minutes · {test.question_count}{' '}
              questions
            </p>
            <p className="m-0 mt-stack-md text-body-md text-on-surface-variant">
              The timed mock exam player will connect here. For now, continue studying lessons for
              this level to prepare.
            </p>
            <ButtonLink
              className="mt-stack-md inline-flex"
              to={`/learn/${test.hsk_level}/lessons`}
              variant="secondary"
            >
              Study HSK {test.hsk_level} lessons
            </ButtonLink>
          </Card>
        )}
      </QueryContent>
    </FeaturePageShell>
  );
}
