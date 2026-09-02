import { StyleSheet, Text, View } from 'react-native';

import type { PracticeAnswerResult } from '../../api/types';
import { useI18n } from '../../i18n/I18nContext';
import { localizeText } from '../../i18n/content';
import type { TranslationKey } from '../../i18n/translations';
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

const statusKeys: Record<string, TranslationKey> = {
  PENDING: 'speaking.status.PENDING',
  PROCESSING: 'speaking.status.PROCESSING',
  COMPLETED: 'speaking.status.COMPLETED',
  FAILED: 'speaking.status.FAILED',
};

const feedbackKeys: Record<string, TranslationKey> = {
  EXCELLENT: 'speaking.feedback.EXCELLENT',
  GOOD: 'speaking.feedback.GOOD',
  NEEDS_IMPROVEMENT: 'speaking.feedback.NEEDS_IMPROVEMENT',
  PRACTICE_AGAIN: 'speaking.feedback.PRACTICE_AGAIN',
};

export function QuestionFeedback({
  result,
  correct,
  correctAnswer,
  explanation,
  processingStatus,
  speechAnalysis,
  writingEvaluation,
}: {
  result?: PracticeAnswerResult;
  correct?: boolean;
  correctAnswer?: unknown;
  explanation?: string | null;
  processingStatus?: string | null;
  speechAnalysis?: PracticeAnswerResult['speech_analysis'];
  writingEvaluation?: PracticeAnswerResult['writing_evaluation'];
}) {
  const { language, t } = useI18n();
  const isCorrect = result?.correct ?? Boolean(correct);
  const answerValue = result?.correct_answer ?? correctAnswer;
  const explanationText = localizeText(
    result?.explanation_translations,
    language,
    result?.explanation ?? explanation ?? '',
  );
  const analysis = result?.speech_analysis ?? speechAnalysis;
  const writing = result?.writing_evaluation ?? writingEvaluation;
  const status = result?.processing_status ?? processingStatus;
  const scoreRows = [
    [t('speaking.pronunciation'), analysis?.pronunciation_score],
    [t('speaking.accuracy'), analysis?.accuracy_score],
    [t('speaking.fluency'), analysis?.fluency_score],
    [t('speaking.completeness'), analysis?.completeness_score],
  ].filter((row): row is [string, number] => typeof row[1] === 'number');
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.container,
        isCorrect ? styles.correct : styles.incorrect,
      ]}
    >
      <Text
        style={[
          styles.title,
          isCorrect ? styles.correctText : styles.incorrectText,
        ]}
      >
        {isCorrect ? t('common.correct') : t('common.needsReview')}
      </Text>
      {!isCorrect ? (
        <Text style={styles.body}>
          {t('practiceSession.correctAnswer', {
            answer: formatAnswer(answerValue),
          })}
        </Text>
      ) : null}
      {explanationText ? <Text style={styles.body}>{explanationText}</Text> : null}
      {status ? (
        <Text style={styles.body}>
          {t(statusKeys[status] ?? 'speaking.status.PROCESSING')}
        </Text>
      ) : null}
      {analysis ? (
        <View style={styles.extra}>
          {analysis.recognized_text ? (
            <Text style={styles.body}>
              {t('speaking.recognizedText', { text: analysis.recognized_text })}
            </Text>
          ) : null}
          {scoreRows.map(([label, value]) => (
            <Text key={label} style={styles.body}>
              {label}: {Math.round(value)}/100
            </Text>
          ))}
          {analysis.feedback_label ? (
            <Text style={styles.body}>
              {t(feedbackKeys[analysis.feedback_label] ?? 'speaking.feedback.PRACTICE_AGAIN')}
            </Text>
          ) : null}
        </View>
      ) : null}
      {writing ? (
        <View style={styles.extra}>
          <Text style={styles.body}>
            {writing.label === 'STRUCTURED_EVALUATION'
              ? t('writing.structuredEvaluation')
              : t('writing.deterministicEvaluation')}
          </Text>
          {writing.criteria?.map(item => (
            <Text key={item.key} style={styles.body}>
              {t(`writing.criteria.${item.key}` as TranslationKey)}: {item.passed ? t('common.pass') : t('common.needsReview')} ({Math.round(item.score)}%)
            </Text>
          ))}
        </View>
      ) : null}
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
  extra: { gap: 4, marginTop: spacing.stackSm },
});
