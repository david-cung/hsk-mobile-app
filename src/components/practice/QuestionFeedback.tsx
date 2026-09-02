import { StyleSheet, Text, View } from 'react-native';

import type { SpeechAnalysis, WritingEvaluation } from '../../api/types';
import { useI18n } from '../../i18n/I18nContext';
import type { TranslationKey } from '../../i18n/translations';
import { colors, radius, spacing, typography } from '../../theme';

function formatAnswer(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
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
  correct,
  correctAnswer,
  explanation,
  transcript,
  pinyin,
  translation,
  processingStatus,
  speechAnalysis,
  writingEvaluation,
}: {
  correct: boolean;
  correctAnswer: unknown;
  explanation?: string | null;
  transcript?: string | null;
  pinyin?: string | null;
  translation?: string | null;
  processingStatus?: string | null;
  speechAnalysis?: SpeechAnalysis | null;
  writingEvaluation?: WritingEvaluation | null;
}) {
  const { t } = useI18n();
  const scoreRows = [
    [t('speaking.pronunciation'), speechAnalysis?.pronunciation_score],
    [t('speaking.accuracy'), speechAnalysis?.accuracy_score],
    [t('speaking.fluency'), speechAnalysis?.fluency_score],
    [t('speaking.completeness'), speechAnalysis?.completeness_score],
  ].filter((row): row is [string, number] => typeof row[1] === 'number');

  return (
    <View style={[styles.box, correct ? styles.correctBox : styles.incorrectBox]}>
      <Text style={[styles.title, correct ? styles.correctText : styles.incorrectText]}>
        {correct ? t('common.correct') : t('common.needsReview')}
      </Text>
      {!correct ? (
        <Text style={styles.body}>
          {t('quizResult.correctAnswer', { answer: formatAnswer(correctAnswer) })}
        </Text>
      ) : null}
      {explanation ? <Text style={styles.body}>{explanation}</Text> : null}
      {transcript ? <Text style={styles.transcript}>{transcript}</Text> : null}
      {pinyin ? <Text style={styles.body}>{pinyin}</Text> : null}
      {translation ? <Text style={styles.body}>{translation}</Text> : null}
      {processingStatus ? <Text style={styles.body}>{t(statusKeys[processingStatus] ?? 'speaking.status.PROCESSING')}</Text> : null}
      {speechAnalysis ? (
        <View style={styles.speechBox}>
          {speechAnalysis.recognized_text ? (
            <Text style={styles.body}>
              {t('speaking.recognizedText', { text: speechAnalysis.recognized_text })}
            </Text>
          ) : null}
          {scoreRows.map(([label, value]) => (
            <Text key={label} style={styles.body}>
              {label}: {Math.round(value)}/100
            </Text>
          ))}
          {speechAnalysis.feedback_label ? (
            <Text style={styles.body}>
              {t(feedbackKeys[speechAnalysis.feedback_label] ?? 'speaking.feedback.PRACTICE_AGAIN')}
            </Text>
          ) : null}
        </View>
      ) : null}
      {writingEvaluation ? (
        <View style={styles.speechBox}>
          <Text style={styles.body}>
            {writingEvaluation.label === 'STRUCTURED_EVALUATION'
              ? t('writing.structuredEvaluation')
              : t('writing.deterministicEvaluation')}
          </Text>
          {writingEvaluation.criteria?.map(item => (
            <Text key={item.key} style={styles.body}>
              {t(`writing.criteria.${item.key}` as TranslationKey)}: {item.passed ? t('common.pass') : t('common.needsReview')} ({Math.round(item.score)}%)
            </Text>
          ))}
          {typeof writingEvaluation.character_count === 'number' ? (
            <Text style={styles.body}>
              {t('writing.characterCount', { count: String(writingEvaluation.character_count) })}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    padding: spacing.stackMd,
    marginTop: spacing.stackMd,
  },
  correctBox: { backgroundColor: colors.tertiaryContainer },
  incorrectBox: { backgroundColor: colors.errorContainer },
  title: { ...typography.labelMd, marginBottom: spacing.stackSm },
  correctText: { color: colors.onTertiaryContainer },
  incorrectText: { color: colors.onErrorContainer },
  body: { ...typography.bodyMd, color: colors.onSurface },
  transcript: { ...typography.bodyZh, color: colors.onSurface, marginTop: spacing.stackSm },
  speechBox: { gap: 4, marginTop: spacing.stackSm },
});
