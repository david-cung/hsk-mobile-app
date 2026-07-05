import { StyleSheet, View, ViewProps } from 'react-native';

import { colors, radius, shadows, spacing } from '../theme';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: colors.surfaceContainer,
    ...shadows.card,
  },
});
