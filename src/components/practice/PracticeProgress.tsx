import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../i18n/I18nContext';
import { colors, spacing, typography } from '../../theme';
import { ProgressBar } from '../ProgressBar';

export function PracticeProgress({ current, total }: { current: number; total: number }) {
  const { formatNumber } = useI18n();
  const progress = total ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {formatNumber(current)} / {formatNumber(total)}
      </Text>
      <ProgressBar progress={progress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.stackSm },
  label: { ...typography.labelMd, color: colors.onSurfaceVariant },
});
