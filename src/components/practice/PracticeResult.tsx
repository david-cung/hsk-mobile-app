import { StyleSheet, Text, View } from 'react-native';

import type { PracticeAnswer, PracticeResults } from '../../api/types';
import { useI18n } from '../../i18n/I18nContext';
import { localizeText } from '../../i18n/content';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../Button';
import { Card } from '../Card';
import { ProgressBar } from '../ProgressBar';

function formatAnswer(value: PracticeAnswer): string {
  if (Array.isArray(value)) return value.join(' · ');
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([left, right]) => `${left} → ${right}`)
      .join(', ');
  }
  return String(value ?? '');
}

export function PracticeResult({
  results,
  onDone,
}: {
  results: PracticeResults;
  onDone?: () => void;
}) {
  const { language, t, formatNumber } = useI18n();
  return (
    <View>
      <Card style={styles.scoreCard}>
        <Text style={styles.score}>{results.score}%</Text>
        <Text style={styles.summary}>
          {t('practiceResult.summary', {
            correct: formatNumber(results.correct_answers),
            total: formatNumber(results.answered_questions),
          })}
        </Text>
        <ProgressBar progress={results.score} />
      </Card>
      <Text style={styles.reviewTitle}>{t('practiceResult.review')}</Text>
      {results.review.map((item, index) => {
        const promptText = item.prompt ?? item.question?.prompt ?? '';
        const prompt = localizeText(
          item.prompt_translations,
          language,
          promptText,
        );
        const explanation = localizeText(
          item.explanation_translations,
          language,
          item.explanation ?? '',
        );
        const submitted = item.submitted_answer ?? (item.user_answer as PracticeAnswer);
        return (
          <Card key={item.question_id ?? item.question?.id ?? index} style={styles.reviewCard}>
            <Text style={styles.prompt}>{prompt}</Text>
            <Text style={item.correct ? styles.correct : styles.incorrect}>
              {item.correct ? t('common.correct') : t('common.needsReview')}
            </Text>
            <Text style={styles.answer}>
              {t('practiceResult.yourAnswer', {
                answer: formatAnswer(submitted),
              })}
            </Text>
            {!item.correct ? (
              <Text style={styles.answer}>
                {t('practiceSession.correctAnswer', {
                  answer: formatAnswer(item.correct_answer as PracticeAnswer),
                })}
              </Text>
            ) : null}
            {explanation ? (
              <Text style={styles.explanation}>{explanation}</Text>
            ) : null}
          </Card>
        );
      })}
      {onDone ? (
        <Button title={t('common.done')} onPress={onDone} style={styles.doneButton} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    alignItems: 'center',
    marginBottom: spacing.stackLg,
  },
  score: { fontSize: 56, fontWeight: '700', color: colors.primary },
  summary: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginVertical: spacing.stackMd,
  },
  reviewTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
  },
  reviewCard: { marginBottom: spacing.stackMd },
  prompt: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginBottom: spacing.stackSm,
  },
  correct: { ...typography.labelMd, color: colors.tertiary },
  incorrect: { ...typography.labelMd, color: colors.error },
  answer: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
  },
  explanation: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginTop: spacing.stackSm,
  },
  doneButton: { marginTop: spacing.stackLg },
});
