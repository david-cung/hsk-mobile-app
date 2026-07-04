import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Ionicons } from './Icon';
import { colors, radius, shadows, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type IconName = ComponentProps<typeof Ionicons>['name'];

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const contentColor = isPrimary
    ? colors.onPrimary
    : variant === 'secondary'
      ? colors.onSecondaryContainer
      : colors.tertiary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.onPrimary : colors.primary}
          accessibilityLabel="Loading"
        />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <Ionicons name={leftIcon} size={18} color={contentColor} /> : null}
          <Text
            style={[
              styles.label,
              isPrimary && styles.primaryLabel,
              variant === 'secondary' && styles.secondaryLabel,
              variant === 'ghost' && styles.ghostLabel,
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
          {rightIcon ? <Ionicons name={rightIcon} size={18} color={contentColor} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.button,
  },
  secondary: {
    backgroundColor: colors.secondaryContainer,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: { ...typography.labelMd, textAlign: 'center' },
  primaryLabel: { color: colors.onPrimary },
  secondaryLabel: { color: colors.onSecondaryContainer },
  ghostLabel: { color: colors.tertiary },
});
