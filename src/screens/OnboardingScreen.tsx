import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { profileApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { useExamMetadata } from '../hooks/useExamMetadata';
import { colors, radius, spacing, typography } from '../theme';

const GOALS = [
  { labelKey: 'onboarding.goal.travel' as const, marker: 'T', value: 'travel' },
  { labelKey: 'onboarding.goal.business' as const, marker: 'B', value: 'business' },
  { labelKey: 'onboarding.goal.hsk_exam' as const, marker: 'H', value: 'hsk_exam' },
  { labelKey: 'onboarding.goal.culture' as const, marker: 'C', value: 'culture' },
];

export function OnboardingScreen() {
  const { refreshProfile } = useAuth();
  const { t } = useI18n();
  const { levels, revision, isLoading: metadataLoading } = useExamMetadata();
  const [step, setStep] = useState(0);
  const [learningGoal, setLearningGoal] = useState('hsk_exam');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(1);
  const [dailyGoal, setDailyGoal] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    setError(null);
    setLoading(true);
    try {
      await profileApi.update({
        learning_goal: learningGoal,
        target_hsk_level: targetLevel,
        current_hsk_level: currentLevel,
        daily_goal_minutes: dailyGoal,
        onboarding_completed: true,
        ...(revision?.id && levels.find((level) => level.level_number === targetLevel)?.id
          ? {
              target_exam_revision_id: revision.id,
              target_exam_level_id: levels.find((level) => level.level_number === targetLevel)?.id,
            }
          : {}),
      });
      await refreshProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('onboarding.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.step}>
        {t('onboarding.step', { current: step + 1, total: 3 })}
      </Text>

      {step === 0 && (
        <>
          <Text style={styles.title}>{t('onboarding.welcome')}</Text>
          <Text style={styles.body}>{t('onboarding.body')}</Text>
          <Button title={t('onboarding.getStarted')} rightIcon="arrow-forward" onPress={() => setStep(1)} />
        </>
      )}

      {step === 1 && (
        <>
          <Text style={styles.title}>{t('onboarding.goalQuestion')}</Text>
          <View style={styles.grid}>
            {GOALS.map((goal) => (
              <Pressable
                key={goal.value}
                style={[styles.goalCard, learningGoal === goal.value && styles.goalSelected]}
                onPress={() => setLearningGoal(goal.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: learningGoal === goal.value }}
                accessibilityLabel={t(goal.labelKey)}
              >
                <Text style={styles.goalIcon}>{goal.marker}</Text>
                <Text style={styles.goalLabel}>{t(goal.labelKey)}</Text>
              </Pressable>
            ))}
          </View>
          <Button title={t('common.continue')} rightIcon="arrow-forward" onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>{t('onboarding.setPath')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.currentLevel')}</Text>
          <View style={styles.levelRow}>
            {levels.map((level) => {
              const number = level.level_number ?? level.sort_order;
              return (
              <Button
                key={level.id}
                title={level.display_name}
                variant={currentLevel === number ? 'primary' : 'ghost'}
                onPress={() => {
                  setCurrentLevel(number);
                  setTargetLevel((target) => Math.max(target, number));
                }}
                style={styles.levelChip}
              />
              );
            })}
          </View>

          <Text style={styles.subtitle}>{t('onboarding.targetLevel')}</Text>
          <Text style={styles.hint}>{t('onboarding.targetHint')}</Text>
          <View style={styles.levelRow}>
            {levels.map((level) => {
              const number = level.level_number ?? level.sort_order;
              return (
              <Button
                key={level.id}
                title={level.display_name}
                variant={targetLevel === number ? 'primary' : 'ghost'}
                onPress={() => setTargetLevel(Math.max(number, currentLevel))}
                style={styles.levelChip}
              />
              );
            })}
          </View>

          <Text style={styles.subtitle}>{t('onboarding.dailyGoal')}</Text>
          <View style={styles.levelRow}>
            {[15, 30, 45, 60].map((minutes) => (
              <Button
                key={minutes}
                title={`${minutes}m`}
                variant={dailyGoal === minutes ? 'secondary' : 'ghost'}
                onPress={() => setDailyGoal(minutes)}
                style={styles.levelChip}
              />
            ))}
          </View>
          {error ? (
            <View style={styles.errorBox} accessibilityLiveRegion="polite">
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <Button
            title={t('onboarding.startLearning')}
            leftIcon="sparkles-outline"
            onPress={finish}
            loading={loading}
            disabled={loading || metadataLoading || !levels.length}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingTop: 60 },
  step: { ...typography.labelSm, color: colors.primary, marginBottom: spacing.stackMd },
  title: { ...typography.headlineLgMobile, color: colors.onSurface, marginBottom: spacing.stackMd },
  body: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackLg },
  subtitle: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackLg,
    marginBottom: spacing.stackMd,
  },
  hint: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: -spacing.stackSm,
    marginBottom: spacing.stackMd,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackMd, marginBottom: spacing.stackLg },
  goalCard: {
    width: '47%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.cardPadding,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceContainer,
  },
  goalSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFixed,
  },
  goalIcon: { fontSize: 24, color: colors.primary, fontWeight: '700', marginBottom: spacing.stackSm },
  goalLabel: { ...typography.labelMd, color: colors.onSurface },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
    marginBottom: spacing.stackMd,
  },
  levelChip: { minWidth: 70, paddingHorizontal: 12 },
  errorBox: {
    backgroundColor: colors.errorContainer,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    marginBottom: spacing.stackMd,
  },
  errorText: { ...typography.bodyMd, color: colors.onErrorContainer },
});
