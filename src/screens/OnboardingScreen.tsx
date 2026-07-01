import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { profileApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing, typography } from '../theme';

const GOALS = [
  { label: 'Travel', icon: '✈️' },
  { label: 'Business', icon: '💼' },
  { label: 'HSK Exam', icon: '📝' },
  { label: 'Culture', icon: '🏮' },
];

const LEVELS = [1, 2, 3, 4, 5, 6];

export function OnboardingScreen() {
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [targetLevel, setTargetLevel] = useState(1);
  const [dailyGoal, setDailyGoal] = useState(30);
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    setLoading(true);
    try {
      await profileApi.update({
        target_hsk_level: targetLevel,
        current_hsk_level: 1,
        daily_goal_minutes: dailyGoal,
        onboarding_completed: true,
      });
      await refreshProfile();
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
          <Button title="Get Started" onPress={() => setStep(1)} />
        </>
      )}

      {step === 1 && (
        <>
          <Text style={styles.title}>What is your goal?</Text>
          <View style={styles.grid}>
            {GOALS.map((g) => (
              <View key={g.label} style={styles.goalCard}>
                <Text style={styles.goalIcon}>{g.icon}</Text>
                <Text style={styles.goalLabel}>{g.label}</Text>
              </View>
            ))}
          </View>
          <Button title="Continue" onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Choose your target HSK level</Text>
          <View style={styles.levelRow}>
            {LEVELS.map((l) => (
              <Button
                key={l}
                title={`HSK ${l}`}
                variant={targetLevel === l ? 'primary' : 'ghost'}
                onPress={() => setTargetLevel(l)}
                style={styles.levelChip}
              />
            ))}
          </View>
          <Text style={styles.subtitle}>Daily study goal (minutes)</Text>
          <View style={styles.levelRow}>
            {[15, 30, 45, 60].map((m) => (
              <Button
                key={m}
                title={`${m}m`}
                variant={dailyGoal === m ? 'secondary' : 'ghost'}
                onPress={() => setDailyGoal(m)}
                style={styles.levelChip}
              />
            ))}
          </View>
          <Button title="Start Learning" onPress={finish} loading={loading} />
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackMd, marginBottom: spacing.stackLg },
  goalCard: {
    width: '47%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    padding: spacing.cardPadding,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceContainer,
  },
  goalIcon: { fontSize: 32, marginBottom: spacing.stackSm },
  goalLabel: { ...typography.labelMd, color: colors.onSurface },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
    marginBottom: spacing.stackMd,
  },
  levelChip: { minWidth: 70, paddingHorizontal: 12 },
});
