import { EmptyState } from '@/components/ui/EmptyState';

import type { LessonContent as LessonContentData, LessonType } from '../api/lessons.schemas';
import { GrammarSection } from './sections/GrammarSection';
import { ListeningSection } from './sections/ListeningSection';
import { ReadingSection } from './sections/ReadingSection';
import { VocabularySection } from './sections/VocabularySection';
import { WritingSection } from './sections/WritingSection';

type LessonContentProps = {
  lessonType: LessonType;
  content: LessonContentData | null;
};

function hasRenderableMaterials(lessonType: LessonType, content: LessonContentData): boolean {
  switch (lessonType) {
    case 'vocabulary':
      return (content.vocabulary?.length ?? 0) > 0;
    case 'grammar':
      return (content.grammar_points?.length ?? 0) > 0;
    case 'reading':
      return (content.passage?.length ?? 0) > 0 || (content.vocabulary?.length ?? 0) > 0;
    case 'listening':
      return (content.transcript?.length ?? 0) > 0;
    case 'writing':
      return (content.characters?.length ?? 0) > 0;
    case 'mixed':
      return (content.vocabulary?.length ?? 0) > 0 || (content.grammar_points?.length ?? 0) > 0;
    default:
      return false;
  }
}

function LessonMaterialsSections({
  lessonType,
  content,
}: {
  lessonType: LessonType;
  content: LessonContentData;
}) {
  switch (lessonType) {
    case 'vocabulary':
      return content.vocabulary ? <VocabularySection items={content.vocabulary} /> : null;
    case 'grammar':
      return content.grammar_points ? <GrammarSection points={content.grammar_points} /> : null;
    case 'reading':
      return <ReadingSection content={content} />;
    case 'listening':
      return <ListeningSection content={content} />;
    case 'writing':
      return <WritingSection content={content} />;
    case 'mixed':
      return (
        <>
          {content.vocabulary ? <VocabularySection items={content.vocabulary} /> : null}
          {content.grammar_points ? <GrammarSection points={content.grammar_points} /> : null}
        </>
      );
    default: {
      const _exhaustive: never = lessonType;
      return _exhaustive;
    }
  }
}

export function LessonContent({ lessonType, content }: LessonContentProps) {
  if (!content) {
    return (
      <EmptyState
        className="items-start px-0 py-stack-lg text-left"
        description="This lesson does not include study materials yet. You can still take the quiz when it becomes available."
        title="No lesson materials"
      />
    );
  }

  if (!hasRenderableMaterials(lessonType, content)) {
    return (
      <EmptyState
        className="items-start px-0 py-stack-lg text-left"
        description="Study materials for this lesson are not available yet. You can still take the quiz when it becomes available."
        title="No lesson materials"
      />
    );
  }

  return (
    <section aria-label="Lesson materials" className="mt-stack-lg">
      <div className="flex flex-col gap-stack-lg">
        <LessonMaterialsSections content={content} lessonType={lessonType} />
      </div>
    </section>
  );
}

export type { LessonContentProps };
