import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { progressApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenState } from '../components/ScreenState';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import type { TranslationKey } from '../i18n/translations';
import { getLessonTypeLabel } from '../i18n/lessonTypes';
import { colors, radius, spacing, typography } from '../theme';

const HSK_LEVELS = [1, 2, 3, 4, 5, 6];
const TREND_KEYS: Record<string, TranslationKey> = {
  improving: 'progress.trend.improving',
  stable: 'progress.trend.stable',
  declining: 'progress.trend.declining',
};

function metricText(value: number | null | undefined, formatNumber: (value: number) => string) {
  return value == null ? '-' : `${formatNumber(Math.round(value))}%`;
}

export function ProgressScreen() {
  const { profile } = useAuth();
  const { t, formatNumber } = useI18n();
  const [selectedLevel, setSelectedLevel] = useState(profile?.current_hsk_level ?? 1);
  const summaryQuery = useQuery({ queryKey: ['progress-summary'], queryFn: progressApi.summary });
  const hskQuery = useQuery({ queryKey: ['progress-hsk', selectedLevel], queryFn: () => progressApi.hsk(selectedLevel) });
  const activityQuery = useQuery({ queryKey: ['progress-activity', 7], queryFn: () => progressApi.activity(7) });
  const summary = summaryQuery.data;
  const hsk = hskQuery.data;
  const activity = activityQuery.data ?? [];
  const isLoading = summaryQuery.isLoading || hskQuery.isLoading || activityQuery.isLoading;
  const isError = summaryQuery.isError || hskQuery.isError || activityQuery.isError;

  if (isLoading) {
    return <View style={styles.center}><ScreenState type="loading" title={t('progress.loading')} /></View>;
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
            summaryQuery.refetch();
            hskQuery.refetch();
            activityQuery.refetch();
          }}
        />
      </View>
    );
  }

  if (!summary || !hsk) {
    return <View style={styles.center}><ScreenState type="empty" title={t('progress.noProgress')} message={t('progress.noProgressMessage')} /></View>;
  }

  const maxMinutes = Math.max(...activity.map(item => item.study_minutes), 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('progress.title')}</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t('progress.overall')}</Text>
        <Text style={styles.bigValue}>{metricText(summary.overall_progress_percent, formatNumber)}</Text>
        <ProgressBar progress={summary.overall_progress_percent} />
        <Text style={styles.meta}>
          {t('progress.todayLine', {
            minutes: formatNumber(summary.today_study_minutes),
            questions: formatNumber(summary.today_questions),
            accuracy: summary.today_accuracy == null ? '-' : formatNumber(Math.round(summary.today_accuracy)),
          })}
        </Text>
        <Text style={styles.meta}>
          {t('dailyReview.dueCount', { count: formatNumber(summary.cards_due) })}
          {' · '}
          {t('progress.reviewedToday', { count: formatNumber(summary.cards_reviewed_today) })}
          {summary.review_retention == null ? '' : ` · ${t('progress.retention', { percent: formatNumber(Math.round(summary.review_retention)) })}`}
        </Text>
      </Card>

      <View style={styles.levelSelector}>
        {HSK_LEVELS.map(level => (
          <Pressable
            key={level}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedLevel === level }}
            style={[styles.levelChip, selectedLevel === level && styles.levelChipSelected]}
            onPress={() => setSelectedLevel(level)}
          >
            <Text style={[styles.levelChipText, selectedLevel === level && styles.levelChipTextSelected]}>HSK {level}</Text>
          </Pressable>
        ))}
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{hsk.title}</Text>
        <MetricRow label={t('lessonType.vocabulary')} completed={hsk.vocabulary.completed} total={hsk.vocabulary.total} percent={hsk.vocabulary.percent} />
        <MetricRow label={t('lessonType.grammar')} completed={hsk.grammar.completed} total={hsk.grammar.total} percent={hsk.grammar.percent} />
        <MetricRow label={t('nav.lessons')} completed={hsk.lessons.completed} total={hsk.lessons.total} percent={hsk.lessons.percent} />
        <Text style={styles.meta}>{t('progress.studyMinutes', { minutes: formatNumber(hsk.study_minutes) })}</Text>
      </Card>

      <Text style={styles.sectionTitle}>{t('progress.skillOverview')}</Text>
      {summary.skill_overview.length ? summary.skill_overview.map(skill => {
        const score = skill.skill === 'SPEAKING' ? skill.average_score : skill.accuracy;
        return (
          <Card key={skill.skill} style={styles.skillCard}>
            <View style={styles.skillHeader}>
              <Text style={styles.skillTitle}>{getLessonTypeLabel(skill.skill.toLowerCase(), t)}</Text>
              <Text style={styles.skillScore}>{metricText(score, formatNumber)}</Text>
            </View>
            {score == null ? <Text style={styles.meta}>{t('progress.notPracticed')}</Text> : <ProgressBar progress={score} />}
            <Text style={styles.meta}>
              {t('progress.attemptCount', { count: formatNumber(skill.attempts) })}
              {skill.trend ? ` · ${t(TREND_KEYS[skill.trend] ?? 'progress.trend.stable')}` : ''}
            </Text>
          </Card>
        );
      }) : (
        <ScreenState type="empty" title={t('progress.noSkill')} message={t('progress.noSkillMessage')} compact style={styles.card} />
      )}

      <Text style={styles.sectionTitle}>{t('progress.studyActivity')}</Text>
      <Card style={styles.card}>
        <View style={styles.chart}>
          {activity.map(day => (
            <View key={day.date} style={styles.barWrap}>
              <View style={[styles.bar, { height: Math.max(6, (day.study_minutes / maxMinutes) * 92) }]} />
              <Text style={styles.barLabel}>{new Date(day.date).getDate()}</Text>
            </View>
          ))}
        </View>
      </Card>

      {summary.weak_skills.length ? (
        <>
          <Text style={styles.sectionTitle}>{t('progress.weakAreas')}</Text>
          {summary.weak_skills.map(area => (
            <Card key={`${area.type}-${area.skill}-${area.target_id ?? area.label}`} style={styles.skillCard}>
              <Text style={styles.skillTitle}>{area.label}</Text>
              <Text style={styles.meta}>{area.reason}</Text>
            </Card>
          ))}
        </>
      ) : null}

      {summary.recommended_practice.length ? (
        <>
          <Text style={styles.sectionTitle}>{t('progress.recommendedPractice')}</Text>
          {summary.recommended_practice.map(item => (
            <Card key={`${item.type}-${item.target_id ?? item.target_label}`} style={styles.skillCard}>
              <Text style={styles.skillTitle}>{item.target_label ?? item.type}</Text>
              <Text style={styles.meta}>{item.reason}</Text>
            </Card>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

function MetricRow({ label, completed, total, percent }: { label: string; completed: number; total: number; percent: number | null }) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{completed} / {total}</Text>
      </View>
      <ProgressBar progress={percent ?? 0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
  title: { ...typography.headlineLgMobile, color: colors.onSurface, marginBottom: spacing.stackLg },
  card: { marginBottom: spacing.stackMd },
  cardTitle: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  bigValue: { ...typography.headlineLgMobile, color: colors.primary, marginBottom: spacing.stackSm },
  meta: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  levelSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackSm, marginBottom: spacing.stackMd },
  levelChip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLowest,
  },
  levelChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  levelChipText: { ...typography.labelMd, color: colors.onSurface },
  levelChipTextSelected: { color: colors.onPrimary },
  metricRow: { marginTop: spacing.stackMd },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.stackSm },
  metricLabel: { ...typography.bodyMd, color: colors.onSurface },
  metricValue: { ...typography.labelMd, color: colors.onSurfaceVariant },
  sectionTitle: { ...typography.headlineMd, color: colors.onSurface, marginVertical: spacing.stackMd },
  skillCard: { marginBottom: spacing.stackSm },
  skillHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.stackSm },
  skillTitle: { ...typography.labelMd, color: colors.onSurface },
  skillScore: { ...typography.bodyMd, color: colors.primary },
  chart: { height: 132, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.stackSm },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', maxWidth: 28, borderRadius: radius.sm, backgroundColor: colors.tertiaryContainer },
  barLabel: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 4 },
});
