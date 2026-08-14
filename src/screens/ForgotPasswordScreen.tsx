import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { authApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';


type Navigation = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t('auth.emailInvalid'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('auth.resetRequestFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t('auth.forgotPassword')}</Text>
      <Text style={styles.description}>{t('auth.forgotPasswordDescription')}</Text>
      {submitted ? (
        <>
          <ScreenState
            type="success"
            title={t('auth.resetEmailSent')}
            message={t('auth.resetEmailSentDescription')}
            compact
          />
          <Button
            title={t('auth.enterResetToken')}
            onPress={() => navigation.navigate('ResetPassword')}
            variant="secondary"
            style={styles.button}
          />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder={t('auth.email')}
            placeholderTextColor={colors.onSurfaceVariant}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            accessibilityLabel={t('auth.email')}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title={t('auth.sendResetInstructions')}
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
    backgroundColor: colors.background,
  },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
    marginBottom: spacing.stackLg,
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  error: { ...typography.bodyMd, color: colors.error, marginTop: spacing.stackSm },
  button: { marginTop: spacing.stackMd },
});
