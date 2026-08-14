import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { authApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { colors, radius, spacing, typography } from '../theme';


export function ChangePasswordScreen() {
  const { logout } = useAuth();
  const { t } = useI18n();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (newPassword.length < 8) {
      setError(t('auth.passwordShort'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      Alert.alert(t('auth.passwordChanged'), t('auth.signInAgain'));
      await logout();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('auth.passwordChangeFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput
        style={styles.input}
        placeholder={t('auth.currentPassword')}
        placeholderTextColor={colors.onSurfaceVariant}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        autoComplete="password"
        accessibilityLabel={t('auth.currentPassword')}
      />
      <TextInput
        style={styles.input}
        placeholder={t('auth.newPassword')}
        placeholderTextColor={colors.onSurfaceVariant}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        autoComplete="new-password"
        accessibilityLabel={t('auth.newPassword')}
      />
      <TextInput
        style={styles.input}
        placeholder={t('auth.confirmPassword')}
        placeholderTextColor={colors.onSurfaceVariant}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoComplete="new-password"
        accessibilityLabel={t('auth.confirmPassword')}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title={t('auth.changePassword')}
        onPress={submit}
        loading={loading}
        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.marginMobile,
    gap: spacing.stackMd,
    backgroundColor: colors.background,
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  error: { ...typography.bodyMd, color: colors.error },
});
