import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';

import { contentApi, learningApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function DailyReviewScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
  const { data: levels, isLoading } = useQuery({
    queryKey: ['levels'],
    queryFn: contentApi.levels,
  });
  const reviewLevel =
    levels?.find((level) => level.level_number === (profile?.current_hsk_level ?? 1)) ??
    levels?.[0];

  const { data: lessons } = useQuery({
    queryKey: ['lessons', reviewLevel?.id],
    queryFn: () => contentApi.lessons(reviewLevel!.id),
    enabled: !!reviewLevel,
  });
  const { data: savedWords } = useQuery({
    queryKey: ['savedWords'],
    queryFn: learningApi.savedWords,
  });
  const { data: mistakes } = useQuery({
    queryKey: ['mistakes'],
    queryFn: learningApi.mistakes,
  });

  const reviewLessons = lessons?.filter((l) => l.status === 'completed').slice(0, 3) ?? [];
  const reviewWords = savedWords?.slice(0, 5) ?? [];
  const reviewMistakes = mistakes?.slice(0, 5) ?? [];
  const hasReview = reviewLessons.length > 0 || reviewWords.length > 0 || reviewMistakes.length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Daily Review</Text>
      <Text style={styles.subtitle}>Revisit mistakes, saved words, and completed lessons</Text>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : !hasReview ? (
        <Card>
          <Text style={styles.emptyTitle}>No review items yet</Text>
          <Text style={styles.emptyBody}>
            Complete quizzes or save words, then come back for daily review.
          </Text>
        </Card>
      ) : (
        <>
          {reviewMistakes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Mistakes to Retry</Text>
              {reviewMistakes.map((mistake) => (
                <Card key={`${mistake.attempt_id}-${mistake.question_id}`} style={styles.card}>
                  <Text style={styles.lessonTitle}>{mistake.prompt ?? 'Question review'}</Text>
                  <Text style={styles.meta}>Your answer: {mistake.user_answer || 'No answer'}</Text>
                  <Text style={styles.correct}>Correct answer: {mistake.correct_answer}</Text>
                  {mistake.explanation ? <Text style={styles.meta}>{mistake.explanation}</Text> : null}
                </Card>
              ))}
            </>
          )}

          {reviewWords.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Saved Words</Text>
              {reviewWords.map((word) => (
                <Card key={word.id} style={styles.card}>
                  <Text style={styles.hanzi}>{word.hanzi}</Text>
                  {word.pinyin ? <Text style={styles.meta}>{word.pinyin}</Text> : null}
                  {word.meaning ? <Text style={styles.lessonTitle}>{word.meaning}</Text> : null}
                </Card>
              ))}
            </>
          )}

          {reviewLessons.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Completed Lessons</Text>
              {reviewLessons.map((lesson) => (
                <Card key={lesson.id} style={styles.card}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.meta}>
                    Last score: {lesson.score_percent ?? 0}% · {lesson.lesson_type}
                  </Text>
                  <Button
                    title="Review"
                    variant="secondary"
                    onPress={() =>
                      navigation.navigate('LessonDetail', {
                        lessonId: lesson.id,
                        lessonTitle: lesson.title,
                      })
                    }
                    style={styles.btn}
                  />
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  subtitle: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackLg },
  sectionTitle: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackMd },
  emptyTitle: { ...typography.headlineMd, color: colors.onSurface },
  emptyBody: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  card: { marginBottom: spacing.stackMd },
  lessonTitle: { ...typography.headlineMd, color: colors.onSurface },
  meta: { ...typography.labelMd, color: colors.onSurfaceVariant, marginTop: 4, marginBottom: spacing.stackMd },
  correct: { ...typography.labelMd, color: colors.primary, marginTop: 4, marginBottom: spacing.stackMd },
  hanzi: { fontSize: 32, color: colors.onSurface },
  btn: { alignSelf: 'flex-start' },
});
