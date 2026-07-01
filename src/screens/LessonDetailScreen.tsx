import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { contentApi } from '../api/endpoints';
import type { LessonContent } from '../api/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ChineseLine } from '../components/ChineseLine';
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
  writing: 'Writing',
  mixed: 'Mixed Lesson',
};

function VocabularySection({ items }: { items: NonNullable<LessonContent['vocabulary']> }) {
  return (
    <>
      <Text style={styles.section}>Vocabulary</Text>
      {items.map((word) => (
        <Card key={word.hanzi} style={styles.block}>
          <ChineseLine line={word} large />
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

function LessonBody({ lessonType, content }: { lessonType: string; content: LessonContent | null }) {
  if (!content) return null;

  switch (lessonType) {
    case 'grammar':
      return content.grammar_points ? <GrammarSection points={content.grammar_points} /> : null;
    case 'reading':
      return <ReadingSection content={content} />;
    case 'listening':
      return <ListeningSection content={content} />;
    case 'writing':
      return <WritingSection content={content} />;
    case 'vocabulary':
      return content.vocabulary ? <VocabularySection items={content.vocabulary} /> : null;
    case 'mixed':
      return (
        <>
          {content.vocabulary ? <VocabularySection items={content.vocabulary} /> : null}
          {content.grammar_points ? <GrammarSection points={content.grammar_points} /> : null}
        </>
      );
    default:
      return content.vocabulary ? <VocabularySection items={content.vocabulary} /> : null;
  }
}

export function LessonDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', params.lessonId],
    queryFn: () => contentApi.lesson(params.lessonId),
  });

  if (isLoading || !lesson) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const typeLabel = TYPE_LABELS[lesson.lesson_type] ?? lesson.lesson_type;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.type}>{typeLabel}</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      {lesson.description ? <Text style={styles.description}>{lesson.description}</Text> : null}

      <LessonBody lessonType={lesson.lesson_type} content={lesson.content} />

      <Button
        title="Start Quiz"
        onPress={() =>
          navigation.navigate('Quiz', {
            lessonId: params.lessonId,
            lessonTitle: params.lessonTitle,
          })
        }
        style={styles.quizButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
  pointTitle: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  pointBody: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackMd },
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
});
