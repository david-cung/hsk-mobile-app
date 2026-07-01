import { useCallback, useEffect, useId, useState } from 'react';

import { FeaturePageShell } from '@/components/layout/FeaturePageShell';
import { QueryContent } from '@/components/layout/QueryContent';
import { StaggerItem, StaggerList } from '@/components/layout/StaggerList';
import { FormCardSkeleton, WordCardSkeleton } from '@/components/skeletons/FeatureSkeletons';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMockQuery } from '@/hooks/useMockQuery';

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

function SavedWordsSkeleton() {
  return (
    <>
      <FormCardSkeleton />
      <div className="flex flex-col gap-stack-md">
        <WordCardSkeleton />
        <WordCardSkeleton />
        <WordCardSkeleton />
      </div>
    </>
  );
}

export function SavedWordsPage() {
  const listHeadingId = useId();
  const [words, setWords] = useState<SavedWord[] | null>(null);
  const query = useMockQuery(MOCK_SAVED_WORDS);

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setWords((current) => current ?? query.data ?? []);
    }
  }, [query.isSuccess, query.data]);

  const handleAddWord = useCallback((input: SavedWordCreateInput) => {
    setWords((current) => {
      const list = current ?? [];
      const nextId = list.reduce((maxId, word) => Math.max(maxId, word.id), 0) + 1;
      return [createLocalWord(input, nextId), ...list];
    });
  }, []);

  const displayWords = words ?? [];

  return (
    <FeaturePageShell backTo="/profile" title="Saved Words">
      <QueryContent
        data={query.isSuccess ? displayWords : undefined}
        empty={
          <>
            <Card className="mb-stack-lg bg-surface-container-low">
              <AddWordForm onSubmit={handleAddWord} />
            </Card>
            <EmptyState
              description="Words you save from lessons or add manually will appear here."
              icon="vocabulary"
              title="No saved words yet"
            />
          </>
        }
        errorMessage="We could not load your saved vocabulary. Please try again."
        isEmpty={(items) => items.length === 0}
        isError={query.isError}
        isLoading={query.isLoading}
        loading={<SavedWordsSkeleton />}
        onRetry={query.refetch}
      >
        {(items) => (
          <>
            <Card className="mb-stack-lg bg-surface-container-low transition-shadow duration-200 motion-safe:hover:shadow-elevated">
              <AddWordForm onSubmit={handleAddWord} />
            </Card>

            <section aria-labelledby={listHeadingId}>
              <h2 className="m-0 mb-stack-md text-headline-md text-on-surface" id={listHeadingId}>
                Your words
                <span className="sr-only"> ({items.length} total)</span>
              </h2>
              <StaggerList className="flex flex-col gap-stack-md">
                {items.map((word, index) => (
                  <StaggerItem index={index} key={word.id}>
                    <SavedWordCard word={word} />
                  </StaggerItem>
                ))}
              </StaggerList>
            </section>
          </>
        )}
      </QueryContent>
    </FeaturePageShell>
  );
}
