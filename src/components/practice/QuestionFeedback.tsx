import { StyleSheet, Text, View } from 'react-native';

import type { PracticeAnswerResult } from '../../api/types';
import { useI18n } from '../../i18n/I18nContext';
import { localizeText } from '../../i18n/content';
import { colors, radius, spacing, typography } from '../../theme';

function formatAnswer(value: PracticeAnswerResult['correct_answer']): string {
  if (Array.isArray(value)) return value.join(' · ');
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([left, right]) => `${left} → ${right}`)
      .join(', ');
  }
  return String(value ?? '');
}

export function QuestionFeedback({
  result,
}: {
  result: PracticeAnswerResult;
}) {
  const { language, t } = useI18n();
  const explanation = localizeText(
    result.explanation_translations,
    language,
    result.explanation ?? '',
  );
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.container,
        result.correct ? styles.correct : styles.incorrect,
      ]}
    >
      <Text
        style={[
          styles.title,
          result.correct ? styles.correctText : styles.incorrectText,
        ]}
      >
        {result.correct ? t('common.correct') : t('common.needsReview')}
      </Text>
      {!result.correct ? (
        <Text style={styles.body}>
          {t('practiceSession.correctAnswer', {
            answer: formatAnswer(result.correct_answer),
          })}
        </Text>
      ) : null}
      {explanation ? <Text style={styles.body}>{explanation}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.stackMd,
    marginTop: spacing.stackLg,
  },
  correct: {
    borderColor: colors.tertiary,
    backgroundColor: colors.tertiaryContainer,
  },
  incorrect: {
    borderColor: colors.error,
    backgroundColor: colors.errorContainer,
  },
  title: { ...typography.labelMd, marginBottom: spacing.stackSm },
  correctText: { color: colors.tertiary },
  incorrectText: { color: colors.error },
  body: { ...typography.bodyMd, color: colors.onSurface },
});
