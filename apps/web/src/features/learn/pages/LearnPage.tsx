import { LevelRoadmapCard } from '../components/LevelRoadmapCard';
import { PathConnector } from '../components/PathConnector';
import type { LevelRoadmapItem } from '../types';

const LEARN_ROADMAP_LEVELS: LevelRoadmapItem[] = [
  {
    id: 'hsk-1',
    levelLabel: 'HSK 1',
    title: 'Level 1: Fundamentals',
    status: 'completed',
    completionPercent: 100,
    metrics: {
      vocabularyLearned: 150,
      vocabularyTotal: 150,
      grammarLearned: 30,
      grammarTotal: 30,
    },
  },
  {
    id: 'hsk-3',
    levelLabel: 'HSK 3',
    title: 'Level 3: Intermediate',
    status: 'active',
    completionPercent: 65,
    metrics: {
      vocabularyLearned: 420,
      vocabularyTotal: 600,
      grammarLearned: 45,
      grammarTotal: 80,
    },
  },
  {
    id: 'hsk-4',
    levelLabel: 'HSK 4',
    title: 'Level 4: Advanced Int.',
    status: 'locked',
    completionPercent: 0,
    metrics: {
      vocabularyLearned: 0,
      vocabularyTotal: 1200,
      grammarLearned: 0,
      grammarTotal: 100,
    },
  },
];

export function LearnPage() {
  return (
    <>
      <header
        className="border-b border-surface-container bg-surface-container-lowest"
        role="banner"
      >
        <p className="m-0 px-margin-mobile py-stack-md text-headline-md text-primary">Learn</p>
      </header>
      <main
        className="mx-auto w-full max-w-lg bg-surface-container-low px-margin-mobile py-stack-lg pb-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <h1 className="m-0 mb-stack-md text-headline-lg-mobile text-on-surface">HSK roadmap</h1>
        <p className="m-0 mb-stack-lg max-w-prose text-body-md text-on-surface-variant">
          Follow a structured path through HSK levels, from fundamentals to advanced proficiency.
        </p>

        <ol aria-label="HSK learning path" className="m-0 flex list-none flex-col p-0">
          {LEARN_ROADMAP_LEVELS.map((level, index) => (
            <li className="flex flex-col items-center" key={level.id}>
              <LevelRoadmapCard level={level} />
              {index < LEARN_ROADMAP_LEVELS.length - 1 ? (
                <PathConnector variant={level.status === 'completed' ? 'completed' : 'default'} />
              ) : null}
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
