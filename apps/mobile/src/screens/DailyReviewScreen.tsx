import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';

import { contentApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function DailyReviewScreen() {
  const navigation = useNavigation<Nav>();
  const { data: levels, isLoading } = useQuery({
    queryKey: ['levels'],
    queryFn: contentApi.levels,
  });

  const firstLevel = levels?.[0];

  const { data: lessons } = useQuery({
    queryKey: ['lessons', firstLevel?.id],
    queryFn: () => contentApi.lessons(firstLevel!.id),
    enabled: !!firstLevel,
  });

  const reviewLessons = lessons?.filter((l) => l.status === 'completed').slice(0, 3) ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Daily Review</Text>
      <Text style={styles.subtitle}>Revisit words and lessons you have studied</Text>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : reviewLessons.length === 0 ? (
        <Card>
          <Text style={styles.emptyTitle}>No lessons to review yet</Text>
          <Text style={styles.emptyBody}>
            Complete a lesson quiz first, then come back for spaced repetition practice.
          </Text>
        </Card>
      ) : (
        reviewLessons.map((lesson) => (
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
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  subtitle: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackLg },
  emptyTitle: { ...typography.headlineMd, color: colors.onSurface },
  emptyBody: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  card: { marginBottom: spacing.stackMd },
  lessonTitle: { ...typography.headlineMd, color: colors.onSurface },
  meta: { ...typography.labelMd, color: colors.onSurfaceVariant, marginTop: 4, marginBottom: spacing.stackMd },
  btn: { alignSelf: 'flex-start' },
});
