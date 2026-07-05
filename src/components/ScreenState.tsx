import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Ionicons } from './Icon';
import { Button } from './Button';
import { colors, radius, spacing, typography } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];
type StateType = 'loading' | 'empty' | 'error' | 'success';

interface ScreenStateProps {
  type: StateType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: IconName;
  compact?: boolean;
  style?: ViewStyle;
  children?: ReactNode;
}

const DEFAULT_ICONS: Record<Exclude<StateType, 'loading'>, IconName> = {
  empty: 'file-tray-outline',
  error: 'alert-circle-outline',
  success: 'checkmark-circle-outline',
};

export function ScreenState({
  type,
  title,
  message,
  actionLabel,
  onAction,
  icon,
  compact,
  style,
  children,
}: ScreenStateProps) {
  const isLoading = type === 'loading';
  const stateIcon = isLoading ? undefined : icon ?? DEFAULT_ICONS[type];
  const tint = type === 'error' ? colors.error : type === 'success' ? colors.tertiary : colors.primary;

  return (
    <View
      style={[styles.container, compact && styles.compact, style]}
      accessibilityRole={isLoading ? 'progressbar' : undefined}
      accessibilityLiveRegion={type === 'error' || type === 'success' ? 'polite' : undefined}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : stateIcon ? (
        <View style={[styles.iconWrap, { backgroundColor: `${tint}14` }]}>
          <Ionicons name={stateIcon} size={28} color={tint} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {children}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant={type === 'error' ? 'ghost' : 'secondary'}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.stackLg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.surfaceContainer,
  },
  compact: {
    padding: spacing.stackMd,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.stackMd,
  },
  title: {
    ...typography.headlineMd,
    color: colors.onSurface,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.stackSm,
  },
  action: {
    marginTop: spacing.stackMd,
    alignSelf: 'stretch',
  },
});
