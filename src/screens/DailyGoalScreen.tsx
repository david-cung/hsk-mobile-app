import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { gamificationApi } from '../api/endpoints';
import type { DailyGoalType } from '../api/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import type { TranslationKey } from '../i18n/translations';
import { colors, spacing, typography } from '../theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const GOAL_TYPES: Array<{
  type: DailyGoalType;
  labelKey: TranslationKey;
  icon: IoniconName;
  targets: number[];
}> = [
  {
    type: 'minutes',
    labelKey: 'dailyGoal.type.minutes',
    icon: 'time-outline',
    targets: [15, 30, 45, 60],
  },
  {
    type: 'exercises',
    labelKey: 'dailyGoal.type.exercises',
    icon: 'checkmark-circle-outline',
    targets: [5, 10, 20, 30],
  },
  {
    type: 'xp',
    labelKey: 'dailyGoal.type.xp',
    icon: 'sparkles-outline',
    targets: [20, 50, 100, 150],
  },
  {
    type: 'lessons',
    labelKey: 'dailyGoal.type.lessons',
    icon: 'book-outline',
    targets: [1, 2, 3, 5],
  },
];

function unitKey(type: DailyGoalType): TranslationKey {
  return `dailyGoal.unit.${type}` as TranslationKey;
}

export function DailyGoalScreen() {
  const { t, formatNumber, formatDate } = useI18n();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['daily-goal'],
    queryFn: gamificationApi.daily,
  });
  const mutation = useMutation({
    mutationFn: gamificationApi.updateDaily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-goal'] });
      queryClient.invalidateQueries({ queryKey: ['gamification-profile'] });
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title={t('dailyGoal.loading')} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('dailyGoal.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => refetch()}
        />
      </View>
    );
  }

  const percent = data.goal_target > 0 ? (data.goal_current / data.goal_target) * 100 : 0;
  const activeType = GOAL_TYPES.find(item => item.type === data.goal_type) ?? GOAL_TYPES[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {mutation.isError ? (
        <ScreenState
          type="error"
          title={t('dailyGoal.couldNotSave')}
          message={mutation.error instanceof Error ? mutation.error.message : t('settings.updateFailed')}
          compact
          style={styles.state}
        />
      ) : null}

      <Card style={styles.summary}>
        <View style={styles.summaryHeader}>
          <View style={styles.iconWrap}>
            <Ionicons name="flag" size={24} color={colors.onPrimary} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.title}>{t('dailyGoal.title')}</Text>
            <Text style={styles.subtitle}>
              {t('dailyGoal.date', { date: formatDate(data.date) })}
            </Text>
          </View>
        </View>
        <ProgressBar progress={percent} color={colors.secondary} height={10} />
        <Text style={styles.progressText}>
          {t('dailyGoal.progressValue', {
            current: formatNumber(data.goal_current),
            target: formatNumber(data.goal_target),
            unit: t(unitKey(data.goal_type)),
          })}
        </Text>
      </Card>

      <Text style={styles.section}>{t('dailyGoal.goalType')}</Text>
      <View style={styles.typeGrid}>
        {GOAL_TYPES.map(item => {
          const selected = item.type === data.goal_type;
          return (
            <Button
              key={item.type}
              title={t(item.labelKey)}
              leftIcon={item.icon}
              variant={selected ? 'primary' : 'ghost'}
              disabled={mutation.isPending}
              onPress={() =>
                mutation.mutate({
                  goal_type: item.type,
                  target: item.targets.includes(data.goal_target)
                    ? data.goal_target
                    : item.targets[1],
                })
              }
              style={styles.typeButton}
            />
          );
        })}
      </View>

      <Text style={styles.section}>{t('dailyGoal.target')}</Text>
      <View style={styles.targetGrid}>
        {activeType.targets.map(target => (
          <Button
            key={target}
            title={`${formatNumber(target)} ${t(unitKey(activeType.type))}`}
            variant={target === data.goal_target ? 'secondary' : 'ghost'}
            disabled={mutation.isPending}
            onPress={() => mutation.mutate({ target })}
            style={styles.targetButton}
          />
        ))}
      </View>

      <Text style={styles.section}>{t('dailyGoal.todayActivity')}</Text>
      <View style={styles.metricGrid}>
        <Metric icon="sparkles-outline" label={t('gamification.todayXp')} value={data.xp} />
        <Metric icon="time-outline" label={t('dailyGoal.type.minutes')} value={data.minutes} />
        <Metric icon="checkmark-circle-outline" label={t('dailyGoal.type.exercises')} value={data.exercises} />
        <Metric icon="book-outline" label={t('dailyGoal.type.lessons')} value={data.lessons} />
        <Metric icon="refresh-outline" label={t('dailyGoal.reviews')} value={data.reviews} />
        <Metric icon="flame-outline" label={t('home.studyStreak')} value={data.streak_days} />
      </View>
    </ScrollView>
  );
}

function Metric({ icon, label, value }: { icon: IoniconName; label: string; value: number }) {
  const { formatNumber } = useI18n();
  return (
    <Card style={styles.metric}>
      <Ionicons name={icon} size={22} color={colors.tertiary} />
      <Text style={styles.metricValue}>{formatNumber(value)}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  state: { marginBottom: spacing.stackMd },
  summary: { marginBottom: spacing.stackLg },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackMd,
    marginBottom: spacing.stackMd,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: { flex: 1 },
  title: { ...typography.headlineMd, color: colors.onSurface },
  subtitle: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 2 },
  progressText: { ...typography.bodyMd, color: colors.onSurface, marginTop: spacing.stackSm },
  section: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
    marginBottom: spacing.stackLg,
  },
  typeButton: { width: '48%', paddingHorizontal: 10 },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
    marginBottom: spacing.stackLg,
  },
  targetButton: { minWidth: 92, paddingHorizontal: 12 },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
  },
  metric: { width: '48%', minHeight: 112 },
  metricValue: { ...typography.headlineMd, color: colors.onSurface, marginTop: spacing.stackSm },
  metricLabel: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 2 },
});
