import { useId } from 'react';

import { FeaturePageShell } from '@/components/layout/FeaturePageShell';
import { QueryContent } from '@/components/layout/QueryContent';
import { StaggerItem, StaggerList } from '@/components/layout/StaggerList';
import { MockTestCardSkeleton } from '@/components/skeletons/FeatureSkeletons';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMockQuery } from '@/hooks/useMockQuery';

import { MockTestCard } from '../components/MockTestCard';
import { MOCK_TEST_CATALOG } from '../types';

function MockTestsSkeleton() {
  return (
    <div className="flex flex-col gap-stack-md">
      {Array.from({ length: 4 }, (_, index) => (
        <MockTestCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function MockTestsPage() {
  const listHeadingId = useId();
  const query = useMockQuery(MOCK_TEST_CATALOG);

  return (
    <FeaturePageShell backTo="/profile" title="Mock Tests">
      <p className="m-0 mb-stack-lg text-body-md text-on-surface-variant sm:text-body-lg">
        Simulate the HSK exam with timed practice. Choose a level below to open a mock test session.
      </p>

      <QueryContent
        data={query.data}
        empty={
          <EmptyState
            description="Mock exams will appear here once they are available for your level."
            icon="mock-test"
            title="No mock tests available"
          />
        }
        errorMessage="We could not load mock tests. Please try again."
        isEmpty={(items) => items.length === 0}
        isError={query.isError}
        isLoading={query.isLoading}
        loading={<MockTestsSkeleton />}
        onRetry={query.refetch}
      >
        {(tests) => (
          <section aria-labelledby={listHeadingId}>
            <h2 className="sr-only" id={listHeadingId}>
              Available mock tests
            </h2>
            <StaggerList className="flex flex-col gap-stack-md">
              {tests.map((test, index) => (
                <StaggerItem index={index} key={test.id}>
                  <MockTestCard test={test} />
                </StaggerItem>
              ))}
            </StaggerList>
          </section>
        )}
      </QueryContent>
    </FeaturePageShell>
  );
}
