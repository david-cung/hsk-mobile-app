import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { profileApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../theme';

export function SettingsScreen() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data: Parameters<typeof profileApi.update>[0], message: string) => {
    setLoading(true);
    try {
      await profileApi.update(data);
      await refreshProfile();
      Alert.alert('Saved', message);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.section}>Study Goals</Text>
      <Text style={styles.label}>Daily goal: {profile?.daily_goal_minutes ?? 30} minutes</Text>
      <View style={styles.row}>
        {[15, 30, 45, 60].map((m) => (
          <Button
            key={m}
            title={`${m}m`}
            variant={profile?.daily_goal_minutes === m ? 'primary' : 'ghost'}
            onPress={() => updateProfile({ daily_goal_minutes: m }, `Daily goal set to ${m} minutes`)}
            disabled={loading}
            style={styles.chip}
          />
        ))}
      </View>

      <Text style={styles.section}>HSK Levels</Text>
      <Text style={styles.label}>Current: HSK {profile?.current_hsk_level ?? 1}</Text>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((level) => (
          <Button
            key={level}
            title={`HSK ${level}`}
            variant={profile?.current_hsk_level === level ? 'primary' : 'ghost'}
            onPress={() =>
              updateProfile(
                {
                  current_hsk_level: level,
                  target_hsk_level: Math.max(profile?.target_hsk_level ?? level, level),
                },
                `Current level set to HSK ${level}`,
              )
            }
            disabled={loading}
            style={styles.chip}
          />
        ))}
      </View>
      <Text style={styles.label}>Target: HSK {profile?.target_hsk_level ?? 1}</Text>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((level) => (
          <Button
            key={level}
            title={`HSK ${level}`}
            variant={profile?.target_hsk_level === level ? 'secondary' : 'ghost'}
            onPress={() =>
              updateProfile(
                { target_hsk_level: Math.max(level, profile?.current_hsk_level ?? 1) },
                `Target level set to HSK ${Math.max(level, profile?.current_hsk_level ?? 1)}`,
              )
            }
            disabled={loading}
            style={styles.chip}
          />
        ))}
      </View>

      <Text style={styles.section}>About</Text>
      <Text style={styles.about}>HSK Chinese Master v1.0.0</Text>
      <Text style={styles.about}>Built with React Native + FastAPI</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile },
  section: { ...typography.headlineMd, color: colors.onSurface, marginTop: spacing.stackLg, marginBottom: spacing.stackMd },
  label: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackSm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackSm },
  chip: { minWidth: 70 },
  about: { ...typography.bodyMd, color: colors.onSurfaceVariant },
});
