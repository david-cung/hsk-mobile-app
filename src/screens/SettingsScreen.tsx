import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { profileApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { LanguageSelector } from '../components/LanguageSelector';
import { ScreenState } from '../components/ScreenState';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { colors, spacing, typography } from '../theme';

export function SettingsScreen() {
  const { profile, refreshProfile, deleteAccount } = useAuth();
  const { t } = useI18n();
  const navigation = useRootNavigation();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hskLevels = [1, 2, 3, 4, 5, 6];

  const confirmDeleteAccount = () => {
    Alert.alert(t('auth.deleteAccount'), t('auth.deleteAccountWarning'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.deleteAccount'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAccount();
          } catch (reason) {
            setError(
              reason instanceof Error ? reason.message : t('auth.deleteAccountFailed'),
            );
          }
        },
      },
    ]);
  };

  const updateProfile = async (data: Parameters<typeof profileApi.update>[0], message: string) => {
    setNotice(null);
    setError(null);
    setLoading(true);
    try {
      await profileApi.update(data);
      await refreshProfile();
      setNotice(message);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('settings.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {notice ? (
        <ScreenState type="success" title={notice} compact style={styles.state} />
      ) : null}
      {error ? (
        <ScreenState type="error" title={t('settings.couldNotSave')} message={error} compact style={styles.state} />
      ) : null}

      <LanguageSelector />

      <Text style={styles.section}>{t('settings.studyGoals')}</Text>
      <Text style={styles.label}>
        {t('settings.dailyGoalValue', { minutes: profile?.daily_goal_minutes ?? 30 })}
      </Text>
      <View style={styles.row}>
        {[15, 30, 45, 60].map((m) => (
          <Button
            key={m}
            title={`${m}m`}
            variant={profile?.daily_goal_minutes === m ? 'primary' : 'ghost'}
            onPress={() =>
              updateProfile(
                { daily_goal_minutes: m },
                t('settings.dailyGoalSaved', { minutes: m }),
              )
            }
            disabled={loading}
            style={styles.chip}
          />
        ))}
      </View>

      <Text style={styles.section}>{t('settings.hskLevels')}</Text>
      <Text style={styles.label}>
        {t('settings.currentLevel', { level: profile?.current_hsk_level ?? 1 })}
      </Text>
      <View style={styles.row}>
        {hskLevels.map((level) => (
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
                t('settings.currentSaved', { level }),
              )
            }
            disabled={loading}
            style={styles.chip}
          />
        ))}
      </View>
      <Text style={styles.label}>
        {t('settings.targetLevel', { level: profile?.target_hsk_level ?? 1 })}
      </Text>
      <View style={styles.row}>
        {hskLevels.map((level) => (
          <Button
            key={level}
            title={`HSK ${level}`}
            variant={profile?.target_hsk_level === level ? 'secondary' : 'ghost'}
            onPress={() =>
              updateProfile(
                { target_hsk_level: Math.max(level, profile?.current_hsk_level ?? 1) },
                t('settings.targetSaved', { level: Math.max(level, profile?.current_hsk_level ?? 1) }),
              )
            }
            disabled={loading}
            style={styles.chip}
          />
        ))}
      </View>

      <Text style={styles.section}>{t('auth.accountSecurity')}</Text>
      <Button
        title={t('auth.changePassword')}
        onPress={() => navigation.navigate('ChangePassword')}
        variant="secondary"
      />
      <Button
        title={t('auth.deleteAccount')}
        onPress={confirmDeleteAccount}
        variant="ghost"
        style={styles.deleteButton}
      />

      <Text style={styles.section}>{t('settings.about')}</Text>
      <Text style={styles.about}>{t('app.name')} v1.0.0</Text>
      <Text style={styles.about}>{t('settings.builtWith')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile },
  state: { marginBottom: spacing.stackMd },
  section: { ...typography.headlineMd, color: colors.onSurface, marginTop: spacing.stackLg, marginBottom: spacing.stackMd },
  label: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackSm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackSm },
  chip: { minWidth: 70 },
  deleteButton: { marginTop: spacing.stackMd },
  about: { ...typography.bodyMd, color: colors.onSurfaceVariant },
});
