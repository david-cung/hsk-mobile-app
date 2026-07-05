import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { progressApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenState } from '../components/ScreenState';
import { colors, spacing, typography } from '../theme';

export function ProgressScreen() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: progressApi.dashboard,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title="Loading progress" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title="Could not load progress"
          message="Please check your connection and try again."
          actionLabel="Try Again"
          onAction={() => {
            refetch();
          }}
        />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="empty"
          title="No progress yet"
          message="Complete a lesson quiz to start building your dashboard."
        />
      </View>
    );
  }

  const dailyPercent = data.daily_goal_minutes
    ? Math.round((data.minutes_studied_today / data.daily_goal_minutes) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Progress Dashboard</Text>

      <Card style={styles.cardSpacing}>
        <Text style={styles.cardTitle}>HSK Level {data.current_hsk_level}</Text>
        <Text style={styles.cardSub}>Target: HSK {data.target_hsk_level}</Text>
        <View style={{ marginTop: spacing.stackMd }}>
          <ProgressBar progress={data.exam_readiness_percent} />
        </View>
        <Text style={styles.meta}>
          {data.current_level_completed_lessons} / {data.current_level_total_lessons} lessons at this level
        </Text>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.half}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{data.lessons_completed}</Text>
        </Card>
        <Card style={styles.half}>
          <Text style={styles.statLabel}>In Progress</Text>
          <Text style={styles.statValue}>{data.lessons_in_progress}</Text>
        </Card>
      </View>

      <Card style={styles.cardSpacing}>
        <Text style={styles.cardTitle}>Daily Goal</Text>
        <Text style={styles.statValue}>
          {data.minutes_studied_today} / {data.daily_goal_minutes} min
        </Text>
        <ProgressBar progress={dailyPercent} color={colors.tertiaryContainer} />
      </Card>

      <Card style={styles.cardSpacing}>
        <Text style={styles.cardTitle}>Study Streak</Text>
        <Text style={styles.statValue}>{data.study_streak_days} days</Text>
      </Card>

      {data.skill_breakdown.length ? (
        <>
          <Text style={styles.sectionTitle}>Skill Readiness</Text>
          {data.skill_breakdown.map((skill) => {
            const percent = skill.total ? Math.round((skill.completed / skill.total) * 100) : 0;
            return (
              <Card key={skill.lesson_type} style={styles.attemptCard}>
                <View style={styles.skillHeader}>
                  <Text style={styles.attemptTitle}>{skill.lesson_type}</Text>
                  <Text style={styles.attemptScore}>
                    {skill.average_score != null ? `${skill.average_score}% avg` : `${percent}%`}
                  </Text>
                </View>
                <ProgressBar progress={percent} />
              </Card>
            );
          })}
        </>
      ) : (
        <ScreenState
          type="empty"
          title="No skill readiness yet"
          message="Skill progress appears after you complete lesson quizzes."
          compact
          style={styles.cardSpacing}
        />
      )}

      {data.recent_attempts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Quizzes</Text>
          {data.recent_attempts.map((a) => (
            <Card key={a.attempt_id} style={styles.attemptCard}>
              <Text style={styles.attemptTitle}>{a.lesson_title ?? `Lesson #${a.lesson_id}`}</Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
  title: { ...typography.headlineLgMobile, color: colors.onSurface, marginBottom: spacing.stackLg },
  cardSpacing: { marginBottom: spacing.stackMd },
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
  skillHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.stackSm },
});
