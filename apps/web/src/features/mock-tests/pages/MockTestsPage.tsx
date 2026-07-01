import { useId } from 'react';

import { TopAppBar } from '@/components/navigation/TopAppBar';

import { MockTestCard } from '../components/MockTestCard';
import { MOCK_TEST_CATALOG } from '../types';

export function MockTestsPage() {
  const listHeadingId = useId();

  return (
    <>
      <TopAppBar backTo="/profile" title="Mock Tests" />
      <main
        className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <p className="m-0 mb-stack-lg text-body-md text-on-surface-variant">
          Simulate the HSK exam with timed practice. Choose a level below to open a mock test
          session.
        </p>

        <section aria-labelledby={listHeadingId}>
          <h2 className="sr-only" id={listHeadingId}>
            Available mock tests
          </h2>
          <ul className="m-0 flex list-none flex-col gap-stack-md p-0">
            {MOCK_TEST_CATALOG.map((test) => (
              <li key={test.id}>
                <MockTestCard test={test} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
