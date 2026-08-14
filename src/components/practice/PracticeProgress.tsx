import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../i18n/I18nContext';
import { colors, spacing, typography } from '../../theme';
import { ProgressBar } from '../ProgressBar';

export function PracticeProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const { t } = useI18n();
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {t('practiceSession.progress', { current, total })}
      </Text>
      <ProgressBar progress={total ? (current / total) * 100 : 0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.stackLg },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackSm,
  },
});
