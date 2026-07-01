import { APP_NAME } from '@/app/config/constants';

import { PracticeModeTile } from '../components/PracticeModeTile';
import type { PracticeMode } from '../types';

const PRACTICE_MODES: PracticeMode[] = [
  {
    id: 'vocabulary',
    label: 'Vocabulary quiz',
    description: 'Daily session',
    href: '/practice/vocabulary',
    variant: 'default',
    iconColor: 'primary',
  },
  {
    id: 'grammar',
    label: 'Grammar quiz',
    description: 'Rule mastery',
    href: '/practice/grammar',
    variant: 'default',
    iconColor: 'tertiary',
  },
  {
    id: 'listening',
    label: 'Listening practice',
    description: 'Audio drills',
    href: '/practice/listening',
    variant: 'default',
    iconColor: 'secondary',
  },
  {
    id: 'reading',
    label: 'Reading practice',
    description: 'Text comprehension',
    href: '/practice/reading',
    variant: 'default',
    iconColor: 'primary',
  },
  {
    id: 'writing',
    label: 'Writing practice',
    description: 'Character stroke',
    href: '/practice/writing',
    variant: 'default',
    iconColor: 'tertiary',
  },
  {
    id: 'mixed-review',
    label: 'Mixed review',
    description: 'AI adaptive',
    href: '/practice/mixed-review',
    variant: 'featured',
    iconColor: 'on-primary',
  },
];

export function PracticePage() {
  return (
    <>
      <header
        className="border-b border-surface-container bg-surface-container-lowest"
        role="banner"
      >
        <p className="m-0 px-margin-mobile py-stack-md text-headline-md text-primary">
          Practice Hub
        </p>
      </header>
      <main
        className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <p className="m-0 mb-stack-sm text-label-sm uppercase tracking-wide text-on-surface-variant">
          Strengthen your skills
        </p>
        <h1 className="m-0 mb-stack-md text-headline-lg-mobile text-on-surface">
          Choose your practice mode
        </h1>
        <p className="m-0 mb-stack-lg max-w-prose text-body-md text-on-surface-variant">
          Build fluency with vocabulary, grammar, listening, reading, and writing drills aligned to{' '}
          {APP_NAME}.
        </p>

        <section aria-labelledby="practice-modes-heading">
          <h2 className="sr-only" id="practice-modes-heading">
            Practice modes
          </h2>
          <ul className="m-0 grid list-none grid-cols-2 gap-stack-md p-0">
            {PRACTICE_MODES.map((mode) => (
              <li key={mode.id}>
                <PracticeModeTile mode={mode} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
