import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing, typography } from '../theme';

export function AuthScreen() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validate = () => {
    const nextErrors: typeof errors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    if (displayName.trim().length > 120) {
      nextErrors.displayName = 'Display name must be 120 characters or fewer.';
    }
    return nextErrors;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(email.trim(), password, displayName.trim() || undefined);
      } else {
        await login(email.trim(), password);
      }
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>汉</Text>
        <Text style={styles.title}>HSK Chinese Master</Text>
        <Text style={styles.subtitle}>{isRegister ? 'Create your account' : 'Welcome back'}</Text>

        {isRegister && (
          <View style={styles.field}>
            <TextInput
              style={[styles.input, errors.displayName && styles.inputError]}
              placeholder="Display name"
              placeholderTextColor={colors.onSurfaceVariant}
              value={displayName}
              onChangeText={(value) => {
                setDisplayName(value);
                setErrors((prev) => ({ ...prev, displayName: undefined }));
              }}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              accessibilityLabel="Display name"
            />
            {errors.displayName ? <Text style={styles.errorText}>{errors.displayName}</Text> : null}
          </View>
        )}
        <View style={styles.field}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            placeholderTextColor={colors.onSurfaceVariant}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            returnKeyType="next"
            accessibilityLabel="Email"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>
        <View style={styles.field}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            placeholderTextColor={colors.onSurfaceVariant}
            secureTextEntry
            textContentType={isRegister ? 'newPassword' : 'password'}
            autoComplete={isRegister ? 'new-password' : 'password'}
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            accessibilityLabel="Password"
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        {formError ? (
          <View style={styles.formError} accessibilityLiveRegion="polite">
            <Text style={styles.formErrorText}>{formError}</Text>
          </View>
        ) : null}

        <Button
          title={isRegister ? 'Sign Up' : 'Sign In'}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          leftIcon={isRegister ? 'person-add-outline' : 'log-in-outline'}
          style={styles.button}
        />
        <Button
          title={isRegister ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          onPress={() => {
            setIsRegister(!isRegister);
            setErrors({});
            setFormError(null);
          }}
          variant="ghost"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    padding: spacing.marginMobile,
    justifyContent: 'center',
  },
  logo: { fontSize: 56, color: colors.primary, textAlign: 'center', marginBottom: spacing.stackMd },
  title: { ...typography.headlineLgMobile, color: colors.onSurface, textAlign: 'center' },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.stackLg,
  },
  field: { marginBottom: spacing.stackMd },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    ...typography.bodyMd,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.surfaceContainer,
  },
  inputError: { borderColor: colors.error, backgroundColor: colors.errorContainer },
  errorText: { ...typography.labelSm, color: colors.error, marginTop: 4 },
  formError: {
    backgroundColor: colors.errorContainer,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    marginBottom: spacing.stackMd,
  },
  formErrorText: { ...typography.bodyMd, color: colors.onErrorContainer },
  button: { marginTop: spacing.stackSm, marginBottom: spacing.stackMd },
});
