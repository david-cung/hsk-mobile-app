import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { progressApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { colors, spacing, typography } from '../theme';

export function ProgressScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: progressApi.dashboard,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const dailyPercent = data
    ? Math.round((data.minutes_studied_today / data.daily_goal_minutes) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Progress Dashboard</Text>

      <Card>
        <Text style={styles.cardTitle}>HSK Level {data?.current_hsk_level ?? 1}</Text>
        <Text style={styles.cardSub}>Target: HSK {data?.target_hsk_level ?? 1}</Text>
        <View style={{ marginTop: spacing.stackMd }}>
          <ProgressBar progress={65} />
        </View>
        <Text style={styles.meta}>Keep practicing to reach your target</Text>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.half}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{data?.lessons_completed ?? 0}</Text>
        </Card>
        <Card style={styles.half}>
          <Text style={styles.statLabel}>In Progress</Text>
          <Text style={styles.statValue}>{data?.lessons_in_progress ?? 0}</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Daily Goal</Text>
        <Text style={styles.statValue}>
          {data?.minutes_studied_today ?? 0} / {data?.daily_goal_minutes ?? 30} min
        </Text>
        <ProgressBar progress={dailyPercent} color={colors.tertiaryContainer} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Study Streak</Text>
        <Text style={styles.statValue}>{data?.study_streak_days ?? 0} days</Text>
      </Card>

      {data?.recent_attempts && data.recent_attempts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Quizzes</Text>
          {data.recent_attempts.map((a) => (
            <Card key={a.attempt_id} style={styles.attemptCard}>
              <Text style={styles.attemptTitle}>Lesson #{a.lesson_id}</Text>
              <Text style={styles.attemptScore}>Score: {a.score}%</Text>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.headlineLgMobile, color: colors.onSurface, marginBottom: spacing.stackLg },
  cardTitle: { ...typography.headlineMd, color: colors.onSurface },
  cardSub: { ...typography.labelMd, color: colors.onSurfaceVariant, marginTop: 4 },
  meta: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  grid: { flexDirection: 'row', gap: spacing.stackMd, marginVertical: spacing.stackMd },
  half: { flex: 1 },
  statLabel: { ...typography.labelMd, color: colors.onSurfaceVariant },
  statValue: { ...typography.headlineLgMobile, color: colors.onSurface, marginTop: 4 },
  sectionTitle: { ...typography.headlineMd, color: colors.onSurface, marginVertical: spacing.stackMd },
  attemptCard: { marginBottom: spacing.stackSm },
  attemptTitle: { ...typography.labelMd, color: colors.onSurface },
  attemptScore: { ...typography.bodyMd, color: colors.primary, marginTop: 4 },
});
