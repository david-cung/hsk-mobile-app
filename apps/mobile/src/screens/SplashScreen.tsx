import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>汉</Text>
      <Text style={styles.title}>HSK Chinese Master</Text>
      <Text style={styles.subtitle}>Master Mandarin with confidence</Text>
      <ActivityIndicator color={colors.primary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.marginMobile,
  },
  logo: {
    fontSize: 72,
    color: colors.onPrimary,
    marginBottom: spacing.stackMd,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onPrimaryContainer,
    marginTop: spacing.stackSm,
    textAlign: 'center',
  },
  loader: { marginTop: spacing.stackLg },
});
