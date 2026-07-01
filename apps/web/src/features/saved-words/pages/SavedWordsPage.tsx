import { useCallback, useId, useState } from 'react';

import { TopAppBar } from '@/components/navigation/TopAppBar';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

import type { SavedWord, SavedWordCreateInput } from '../api/savedWords.schemas';
import { AddWordForm } from '../components/AddWordForm';
import { SavedWordCard } from '../components/SavedWordCard';

const MOCK_SAVED_WORDS: SavedWord[] = [
  {
    id: 1,
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Hello / Hi',
    hsk_level: 1,
    saved_at: '2026-06-28T10:00:00.000Z',
  },
  {
    id: 2,
    hanzi: '谢谢',
    pinyin: 'xiè xie',
    meaning: 'Thank you',
    hsk_level: 2,
    saved_at: '2026-06-25T14:30:00.000Z',
  },
  {
    id: 3,
    hanzi: '漂亮',
    pinyin: 'piào liang',
    meaning: 'Beautiful / Pretty',
    hsk_level: 3,
    saved_at: '2026-06-23T09:15:00.000Z',
  },
  {
    id: 4,
    hanzi: '再见',
    pinyin: 'zài jiàn',
    meaning: 'Goodbye / See you again',
    hsk_level: 1,
    saved_at: '2026-06-23T18:45:00.000Z',
  },
];

function createLocalWord(input: SavedWordCreateInput, nextId: number): SavedWord {
  return {
    id: nextId,
    hanzi: input.hanzi,
    pinyin: input.pinyin || null,
    meaning: input.meaning || null,
    hsk_level: null,
    saved_at: new Date().toISOString(),
  };
}

export function SavedWordsPage() {
  const listHeadingId = useId();
  const [words, setWords] = useState<SavedWord[]>(MOCK_SAVED_WORDS);
  const [nextId, setNextId] = useState(MOCK_SAVED_WORDS.length + 1);

  const handleAddWord = useCallback(
    (input: SavedWordCreateInput) => {
      setWords((current) => [createLocalWord(input, nextId), ...current]);
      setNextId((id) => id + 1);
    },
    [nextId],
  );

  return (
    <>
      <TopAppBar backTo="/profile" title="Saved Vocabulary" />
      <main
        className="mx-auto w-full max-w-lg px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <Card className="mb-stack-lg bg-surface-container-low">
          <AddWordForm onSubmit={handleAddWord} />
        </Card>

        {words.length === 0 ? (
          <EmptyState
            description="Words you save from lessons or add manually will appear here."
            title="No saved words yet"
          />
        ) : (
          <section aria-labelledby={listHeadingId}>
            <h2 className="m-0 mb-stack-md text-headline-md text-on-surface" id={listHeadingId}>
              Your words
              <span className="sr-only"> ({words.length} total)</span>
            </h2>
            <ul className="m-0 flex list-none flex-col gap-stack-md p-0">
              {words.map((word) => (
                <li key={word.id}>
                  <SavedWordCard word={word} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
