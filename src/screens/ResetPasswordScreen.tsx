import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { authApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';


type Navigation = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type Route = RouteProp<RootStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen() {
  const navigation = useNavigation<Navigation>();
  const { params } = useRoute<Route>();
  const { t } = useI18n();
  const [token, setToken] = useState(params?.token ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!token.trim()) {
      setError(t('auth.resetTokenRequired'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.passwordShort'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.resetPassword(token.trim(), password);
      setComplete(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('auth.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t('auth.resetPassword')}</Text>
      {complete ? (
        <>
          <ScreenState
            type="success"
            title={t('auth.passwordResetComplete')}
            message={t('auth.passwordResetCompleteDescription')}
            compact
          />
          <Button
            title={t('auth.backToSignIn')}
            onPress={() => navigation.navigate('Auth')}
            style={styles.button}
          />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder={t('auth.resetToken')}
            placeholderTextColor={colors.onSurfaceVariant}
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={t('auth.resetToken')}
          />
          <TextInput
            style={styles.input}
            placeholder={t('auth.newPassword')}
            placeholderTextColor={colors.onSurfaceVariant}
            value={password}
            onChangeText={setPassword}
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
            title={t('auth.resetPassword')}
            onPress={submit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          />
        </>
      )}
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
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  error: { ...typography.bodyMd, color: colors.error },
  button: { marginTop: spacing.stackSm },
});
