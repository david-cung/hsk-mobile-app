import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { contentApi, learningApi } from '../api/endpoints';
import type { LessonContent } from '../api/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ChineseLine } from '../components/ChineseLine';
import { ScreenState } from '../components/ScreenState';
import { SpeakButton } from '../components/SpeakButton';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'LessonDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const TYPE_LABELS: Record<string, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  reading: 'Reading',
  listening: 'Listening',
  sentence_pattern: 'Sentence Pattern',
  conversation: 'Conversation',
  review: 'Review',
  practice: 'Practice',
  quiz: 'Quiz',
  writing: 'Writing',
  mixed: 'Mixed Lesson',
};

function VocabularySection({
  items,
  onSave,
}: {
  items: NonNullable<LessonContent['vocabulary']>;
  onSave: (word: NonNullable<LessonContent['vocabulary']>[number]) => void;
}) {
  return (
    <>
      <Text style={styles.section}>Vocabulary</Text>
      {items.map((word) => (
        <Card key={word.hanzi} style={styles.block}>
          <ChineseLine line={word} large />
          <Button
            title="Save Word"
            leftIcon="bookmark-outline"
            variant="ghost"
            onPress={() => onSave(word)}
            style={styles.saveButton}
          />
        </Card>
      ))}
    </>
  );
}

function GrammarSection({ points }: { points: NonNullable<LessonContent['grammar_points']> }) {
  return (
    <>
      <Text style={styles.section}>Grammar</Text>
      {points.map((point) => (
        <Card key={point.title} style={styles.block}>
          <Text style={styles.pointTitle}>{point.title}</Text>
          <Text style={styles.pointBody}>{point.explanation}</Text>
          <Text style={styles.examplesLabel}>Examples</Text>
          {point.examples.map((ex) => (
            <View key={ex.hanzi} style={styles.example}>
              <ChineseLine line={ex} />
            </View>
          ))}
        </Card>
      ))}
    </>
  );
}

function ChineseEntrySection({ title, line }: { title: string; line: NonNullable<LessonContent['dialogue']> }) {
  return (
    <>
      <Text style={styles.section}>{title}</Text>
      <Card style={styles.block}>
        <ChineseLine line={line} />
      </Card>
    </>
  );
}

function PatternsSection({ patterns }: { patterns: NonNullable<LessonContent['patterns']> }) {
  return (
    <>
      <Text style={styles.section}>Patterns</Text>
      {patterns.map((pattern) => (
        <Card key={pattern.hanzi} style={styles.block}>
          <ChineseLine line={pattern} />
        </Card>
      ))}
    </>
  );
}

function TextListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <>
      <Text style={styles.section}>{title}</Text>
      <Card style={styles.block}>
        {items.map((item) => (
          <Text key={item} style={styles.listItem}>
            {item}
          </Text>
        ))}
      </Card>
    </>
  );
}

function CulturalNoteSection({ note }: { note: NonNullable<LessonContent['cultural_note']> }) {
  if (!note.english && !note.vietnamese) return null;
  return (
    <>
      <Text style={styles.section}>Cultural Note</Text>
      <Card style={styles.block}>
        {note.english ? <Text style={styles.pointBody}>{note.english}</Text> : null}
        {note.vietnamese ? <Text style={styles.pointBody}>{note.vietnamese}</Text> : null}
      </Card>
    </>
  );
}

function ReadingSection({ content }: { content: LessonContent }) {
  const fullPassage = content.passage?.map((l) => l.hanzi).join('') ?? '';
  return (
    <>
      <Text style={styles.section}>Reading</Text>
      {content.passage_title ? (
        <Text style={styles.passageTitle}>{content.passage_title}</Text>
      ) : null}
      <Card style={styles.block}>
        <View style={styles.passageHeader}>
          <Text style={styles.readAloud}>Read aloud</Text>
          {fullPassage ? <SpeakButton text={fullPassage} size={24} /> : null}
        </View>
        {content.passage?.map((line, i) => (
          <View key={i} style={styles.passageLine}>
            <ChineseLine line={line} />
          </View>
        ))}
      </Card>
      {content.vocabulary && content.vocabulary.length > 0 ? (
        <>
          <Text style={styles.subSection}>Key words</Text>
          {content.vocabulary.map((w) => (
            <Card key={w.hanzi} style={styles.block}>
              <ChineseLine line={w} />
            </Card>
          ))}
        </>
      ) : null}
    </>
  );
}

function ListeningSection({ content }: { content: LessonContent }) {
  return (
    <>
      <Text style={styles.section}>Listening</Text>
      {content.tip ? <Text style={styles.tip}>{content.tip}</Text> : null}
      {content.transcript?.map((line, i) => (
        <Card key={i} style={styles.block}>
          <ChineseLine line={line} />
        </Card>
      ))}
    </>
  );
}

function WritingSection({ content }: { content: LessonContent }) {
  return (
    <>
      <Text style={styles.section}>Writing</Text>
      {content.tip ? <Text style={styles.tip}>{content.tip}</Text> : null}
      {content.characters?.map((ch) => (
        <Card key={ch.hanzi} style={styles.block}>
          <View style={styles.writingRow}>
            <Text style={styles.writingHanzi}>{ch.hanzi}</Text>
            <SpeakButton text={ch.hanzi} size={26} />
          </View>
          {ch.pinyin ? <Text style={styles.pinyin}>{ch.pinyin}</Text> : null}
          {ch.meaning ? <Text style={styles.meaning}>{ch.meaning}</Text> : null}
          {ch.strokes != null ? (
            <Text style={styles.strokes}>{ch.strokes} strokes</Text>
          ) : null}
        </Card>
      ))}
    </>
  );
}

function LessonBody({
  lessonType,
  content,
  onSaveWord,
}: {
  lessonType: string;
  content: LessonContent | null;
  onSaveWord: (word: NonNullable<LessonContent['vocabulary']>[number]) => void;
}) {
  if (!content) {
    return (
      <ScreenState
        type="empty"
        title="Lesson content unavailable"
        message="You can still start the quiz if questions are ready."
        compact
        style={styles.block}
      />
    );
  }

  switch (lessonType) {
    case 'grammar':
      return content.grammar_points ? <GrammarSection points={content.grammar_points} /> : (
        <ScreenState type="empty" title="No grammar points yet" compact style={styles.block} />
      );
    case 'reading':
      return <ReadingSection content={content} />;
    case 'listening':
      return <ListeningSection content={content} />;
    case 'sentence_pattern':
      return (
        <>
          {content.patterns ? <PatternsSection patterns={content.patterns} /> : null}
          {content.grammar_points ? <GrammarSection points={content.grammar_points} /> : null}
          {content.vocabulary ? <VocabularySection items={content.vocabulary} onSave={onSaveWord} /> : null}
        </>
      );
    case 'conversation':
      return (
        <>
          {content.dialogue ? <ChineseEntrySection title="Dialogue" line={content.dialogue} /> : null}
          {content.vocabulary ? <VocabularySection items={content.vocabulary} onSave={onSaveWord} /> : null}
          {content.grammar_points ? <GrammarSection points={content.grammar_points} /> : null}
          {content.cultural_note ? <CulturalNoteSection note={content.cultural_note} /> : null}
        </>
      );
    case 'review':
      return <TextListSection title="Review" items={content.review_items ?? content.items ?? []} />;
    case 'practice':
      return <TextListSection title="Practice" items={content.activities ?? content.items ?? []} />;
    case 'quiz':
      return <TextListSection title="Quiz Focus" items={content.items ?? []} />;
    case 'writing':
      return <WritingSection content={content} />;
    case 'vocabulary':
      return content.vocabulary ? <VocabularySection items={content.vocabulary} onSave={onSaveWord} /> : (
        <ScreenState type="empty" title="No vocabulary yet" compact style={styles.block} />
      );
    case 'mixed':
      return (
        <>
          {content.vocabulary ? <VocabularySection items={content.vocabulary} onSave={onSaveWord} /> : null}
          {content.grammar_points ? <GrammarSection points={content.grammar_points} /> : null}
        </>
      );
    default:
      return content.vocabulary ? <VocabularySection items={content.vocabulary} onSave={onSaveWord} /> : (
        <ScreenState type="empty" title="Lesson content unavailable" compact style={styles.block} />
      );
  }
}

export function LessonDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    data: lesson,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['lesson', params.lessonId],
    queryFn: () => contentApi.lesson(params.lessonId),
  });
  const saveWordMutation = useMutation({
    mutationFn: (word: NonNullable<LessonContent['vocabulary']>[number]) =>
      learningApi.addSavedWord({
        hanzi: word.hanzi,
        pinyin: word.pinyin,
        meaning: word.meaning,
        hsk_level: lesson?.hsk_level_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedWords'] });
      setSaveError(null);
      setSaveNotice('Word saved to your list.');
    },
    onError: (e) => {
      setSaveNotice(null);
      setSaveError(e instanceof Error ? e.message : 'Failed to save word');
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title="Loading lesson" />
      </View>
    );
  }

  if (isError || !lesson) {
    return (
      <View style={styles.center}>
        <ScreenState
          type={isError ? 'error' : 'empty'}
          title={isError ? 'Could not load lesson' : 'Lesson not found'}
          message={isError ? 'Please check your connection and try again.' : undefined}
          actionLabel={isError ? 'Try Again' : undefined}
          onAction={
            isError
              ? () => {
                  refetch();
                }
              : undefined
          }
        />
      </View>
    );
  }

  const typeLabel = TYPE_LABELS[lesson.lesson_type] ?? lesson.lesson_type;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.type}>{typeLabel}</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      {lesson.description ? <Text style={styles.description}>{lesson.description}</Text> : null}
      {saveNotice ? (
        <ScreenState type="success" title={saveNotice} compact style={styles.inlineState} />
      ) : null}
      {saveError ? (
        <ScreenState type="error" title="Could not save word" message={saveError} compact style={styles.inlineState} />
      ) : null}

      <LessonBody
        lessonType={lesson.lesson_type}
        content={lesson.content}
        onSaveWord={(word) => saveWordMutation.mutate(word)}
      />

      <Button
        title="Start Quiz"
        onPress={() =>
          navigation.navigate('Quiz', {
            lessonId: params.lessonId,
            lessonTitle: params.lessonTitle,
          })
        }
        rightIcon="arrow-forward"
        style={styles.quizButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
  type: { ...typography.labelSm, color: colors.tertiary, textTransform: 'uppercase' },
  title: { ...typography.headlineLgMobile, color: colors.onSurface, marginTop: spacing.stackSm },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackMd,
    marginBottom: spacing.stackLg,
  },
  section: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackMd },
  subSection: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackMd,
    marginBottom: spacing.stackSm,
  },
  block: { marginBottom: spacing.stackMd },
  inlineState: { marginBottom: spacing.stackMd },
  pointTitle: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  pointBody: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackMd },
  listItem: { ...typography.bodyMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  examplesLabel: { ...typography.labelSm, color: colors.primary, marginBottom: spacing.stackSm },
  example: { borderTopWidth: 1, borderTopColor: colors.surfaceContainer, paddingTop: spacing.stackSm },
  passageTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
    textAlign: 'center',
  },
  passageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackMd,
  },
  readAloud: { ...typography.labelMd, color: colors.onSurfaceVariant },
  passageLine: { marginBottom: spacing.stackSm },
  tip: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackMd,
    fontStyle: 'italic',
  },
  writingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  writingHanzi: { fontSize: 56, color: colors.onSurface, fontWeight: '700' },
  pinyin: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 },
  meaning: { ...typography.bodyLg, color: colors.onSurface, marginTop: 4 },
  strokes: { ...typography.labelSm, color: colors.tertiary, marginTop: spacing.stackSm },
  quizButton: { marginTop: spacing.stackLg },
  saveButton: { alignSelf: 'flex-start', marginTop: spacing.stackSm },
});
