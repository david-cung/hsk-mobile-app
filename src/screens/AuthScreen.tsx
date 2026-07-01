import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

  const handleSubmit = async () => {
    if (!email || password.length < 6) {
      Alert.alert('Error', 'Email and password (min 6 chars) are required.');
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, displayName || undefined);
      } else {
        await login(email, password);
      }
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Authentication failed');
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
          <TextInput
            style={styles.input}
            placeholder="Display name"
            placeholderTextColor={colors.onSurfaceVariant}
            value={displayName}
            onChangeText={setDisplayName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.onSurfaceVariant}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.onSurfaceVariant}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title={isRegister ? 'Sign Up' : 'Sign In'}
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
        <Button
          title={isRegister ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          onPress={() => setIsRegister(!isRegister)}
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
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    padding: spacing.stackMd,
    marginBottom: spacing.stackMd,
    ...typography.bodyMd,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.surfaceContainer,
  },
  button: { marginTop: spacing.stackSm, marginBottom: spacing.stackMd },
});
