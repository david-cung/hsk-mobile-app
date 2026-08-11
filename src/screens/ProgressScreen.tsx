import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { progressApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { getLessonTitle } from '../i18n/content';
import { getLessonTypeLabel } from '../i18n/lessonTypes';
import { colors, spacing, typography } from '../theme';

export function ProgressScreen() {
  const { language, t, formatNumber } = useI18n();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: progressApi.dashboard,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title={t('progress.loading')} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('progress.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
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
          title={t('progress.noProgress')}
          message={t('progress.noProgressMessage')}
        />
      </View>
    );
  }

  const dailyPercent = data.daily_goal_minutes
    ? Math.round((data.minutes_studied_today / data.daily_goal_minutes) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('progress.title')}</Text>

      <Card style={styles.cardSpacing}>
        <Text style={styles.cardTitle}>{t('progress.hskLevel', { level: data.current_hsk_level })}</Text>
        <Text style={styles.cardSub}>{t('common.target')}: HSK {data.target_hsk_level}</Text>
        <View style={{ marginTop: spacing.stackMd }}>
          <ProgressBar progress={data.exam_readiness_percent} />
        </View>
        <Text style={styles.meta}>
          {t('progress.lessonsAtLevel', {
            completed: formatNumber(data.current_level_completed_lessons),
            total: formatNumber(data.current_level_total_lessons),
          })}
        </Text>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.half}>
          <Text style={styles.statLabel}>{t('progress.completed')}</Text>
          <Text style={styles.statValue}>{formatNumber(data.lessons_completed)}</Text>
        </Card>
        <Card style={styles.half}>
          <Text style={styles.statLabel}>{t('progress.inProgress')}</Text>
          <Text style={styles.statValue}>{formatNumber(data.lessons_in_progress)}</Text>
        </Card>
      </View>

      <Card style={styles.cardSpacing}>
        <Text style={styles.cardTitle}>{t('home.dailyGoal')}</Text>
        <Text style={styles.statValue}>
          {formatNumber(data.minutes_studied_today)} / {formatNumber(data.daily_goal_minutes)} {t('common.minutesShort')}
        </Text>
        <ProgressBar progress={dailyPercent} color={colors.tertiaryContainer} />
      </Card>

      <Card style={styles.cardSpacing}>
        <Text style={styles.cardTitle}>{t('home.studyStreak')}</Text>
        <Text style={styles.statValue}>{formatNumber(data.study_streak_days)} {t('common.dayLower')}</Text>
      </Card>

      {data.skill_breakdown.length ? (
        <>
          <Text style={styles.sectionTitle}>{t('progress.skillReadiness')}</Text>
          {data.skill_breakdown.map((skill) => {
            const percent = skill.total ? Math.round((skill.completed / skill.total) * 100) : 0;
            return (
              <Card key={skill.lesson_type} style={styles.attemptCard}>
                <View style={styles.skillHeader}>
                  <Text style={styles.attemptTitle}>{getLessonTypeLabel(skill.lesson_type, t)}</Text>
                  <Text style={styles.attemptScore}>
                    {skill.average_score != null
                      ? t('progress.averageShort', { score: skill.average_score })
                      : `${formatNumber(percent)}%`}
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
          title={t('progress.noSkill')}
          message={t('progress.noSkillMessage')}
          compact
          style={styles.cardSpacing}
        />
      )}

      {data.recent_attempts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{t('progress.recentQuizzes')}</Text>
          {data.recent_attempts.map((a) => (
            <Card key={a.attempt_id} style={styles.attemptCard}>
              <Text style={styles.attemptTitle}>
                {getLessonTitle(a, language) || t('progress.lessonNumber', { id: a.lesson_id })}
              </Text>
              <Text style={styles.attemptScore}>{t('common.score')}: {formatNumber(a.score)}%</Text>
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
