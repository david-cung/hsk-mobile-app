import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { profileApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing, typography } from '../theme';

const GOALS = [
  { label: 'Travel', marker: 'T', value: 'travel' },
  { label: 'Business', marker: 'B', value: 'business' },
  { label: 'HSK Exam', marker: 'H', value: 'hsk_exam' },
  { label: 'Culture', marker: 'C', value: 'culture' },
];

const LEVELS = [1, 2, 3, 4, 5, 6];

export function OnboardingScreen() {
  const { refreshProfile } = useAuth();
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
      });
      await refreshProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your learning path.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.step}>Step {step + 1} of 3</Text>

      {step === 0 && (
        <>
          <Text style={styles.title}>Welcome to HSK Chinese Master</Text>
          <Text style={styles.body}>
            Learn Mandarin with structured lessons, quizzes, and progress tracking aligned to HSK
            levels.
          </Text>
          <Button title="Get Started" rightIcon="arrow-forward" onPress={() => setStep(1)} />
        </>
      )}

      {step === 1 && (
        <>
          <Text style={styles.title}>What is your goal?</Text>
          <View style={styles.grid}>
            {GOALS.map((goal) => (
              <Pressable
                key={goal.value}
                style={[styles.goalCard, learningGoal === goal.value && styles.goalSelected]}
                onPress={() => setLearningGoal(goal.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: learningGoal === goal.value }}
                accessibilityLabel={goal.label}
              >
                <Text style={styles.goalIcon}>{goal.marker}</Text>
                <Text style={styles.goalLabel}>{goal.label}</Text>
              </Pressable>
            ))}
          </View>
          <Button title="Continue" rightIcon="arrow-forward" onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Set your HSK path</Text>
          <Text style={styles.subtitle}>Current HSK level</Text>
          <View style={styles.levelRow}>
            {LEVELS.map((level) => (
              <Button
                key={level}
                title={`HSK ${level}`}
                variant={currentLevel === level ? 'primary' : 'ghost'}
                onPress={() => {
                  setCurrentLevel(level);
                  setTargetLevel((target) => Math.max(target, level));
                }}
                style={styles.levelChip}
              />
            ))}
          </View>

          <Text style={styles.subtitle}>Target HSK level</Text>
          <Text style={styles.hint}>Target cannot be lower than your current level.</Text>
          <View style={styles.levelRow}>
            {LEVELS.map((level) => (
              <Button
                key={level}
                title={`HSK ${level}`}
                variant={targetLevel === level ? 'primary' : 'ghost'}
                onPress={() => setTargetLevel(Math.max(level, currentLevel))}
                style={styles.levelChip}
              />
            ))}
          </View>

          <Text style={styles.subtitle}>Daily study goal (minutes)</Text>
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
            title="Start Learning"
            leftIcon="sparkles-outline"
            onPress={finish}
            loading={loading}
            disabled={loading}
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
