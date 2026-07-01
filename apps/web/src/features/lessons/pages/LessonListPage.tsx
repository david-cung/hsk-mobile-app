import { Link, useParams } from 'react-router-dom';

import { TopAppBar } from '@/components/navigation/TopAppBar';
import { EmptyState } from '@/components/ui/EmptyState';

import { LessonList } from '../components/LessonList';
import { useHskLevels } from '../hooks/useHskLevels';

function parseLevelId(levelIdParam: string | undefined): number | undefined {
  if (levelIdParam === undefined) {
    return undefined;
  }

  const levelId = Number(levelIdParam);

  if (!Number.isInteger(levelId) || levelId <= 0) {
    return undefined;
  }

  return levelId;
}

export function LessonListPage() {
  const { levelId: levelIdParam } = useParams<{ levelId: string }>();
  const levelId = parseLevelId(levelIdParam);
  const { data: levels } = useHskLevels();
  const level = levels?.find((item) => item.id === levelId);
  const pageTitle = level?.title ?? 'Lessons';

  return (
    <>
      <TopAppBar backTo="/learn" title={pageTitle} />
      <main
        className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        {level ? (
          <p className="m-0 mb-stack-lg text-body-md text-on-surface-variant">
            {level.description ?? 'Select a lesson to continue your HSK study path.'}
          </p>
        ) : (
          <p className="m-0 mb-stack-lg text-body-md text-on-surface-variant">
            Select a lesson to continue your HSK study path.
          </p>
        )}

        {levelId === undefined ? (
          <EmptyState
            action={
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-stack-md py-2 text-label-md font-semibold text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
                to="/learn"
              >
                Back to roadmap
              </Link>
            }
            description="The level in this link is not valid. Return to the roadmap and choose a level again."
            title="Level not found"
          />
        ) : (
          <LessonList levelId={levelId} />
        )}
      </main>
    </>
  );
}
