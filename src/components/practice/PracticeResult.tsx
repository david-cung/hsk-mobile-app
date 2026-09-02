import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { PracticeResults } from '../../api/types';
import { useI18n } from '../../i18n/I18nContext';
import type { TranslationKey } from '../../i18n/translations';
import { colors, spacing, typography } from '../../theme';
import { Button } from '../Button';
import { Card } from '../Card';
import { ProgressBar } from '../ProgressBar';

function formatAnswer(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value ?? '');
}

const feedbackKeys: Record<string, TranslationKey> = {
  EXCELLENT: 'speaking.feedback.EXCELLENT',
  GOOD: 'speaking.feedback.GOOD',
  NEEDS_IMPROVEMENT: 'speaking.feedback.NEEDS_IMPROVEMENT',
  PRACTICE_AGAIN: 'speaking.feedback.PRACTICE_AGAIN',
};

export function PracticeResult({
  results,
  onDone,
}: {
  results: PracticeResults;
  onDone: () => void;
}) {
  const { t, formatNumber } = useI18n();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {results.score >= 60 ? t('quizResult.greatJob') : t('quizResult.keepPracticing')}
      </Text>
      <Card style={styles.scoreCard}>
        <Text style={styles.score}>{Math.round(results.score)}%</Text>
        <Text style={styles.detail}>
          {t('quizResult.correctCount', {
            correct: formatNumber(results.correct_answers),
            total: formatNumber(results.total_questions),
          })}
        </Text>
        <ProgressBar progress={results.score} />
      </Card>
      <View style={styles.review}>
        <Text style={styles.reviewTitle}>{t('quizResult.answerReview')}</Text>
        {results.review.map((item, index) => (
          <Card key={`${item.question.id}-${index}`} style={styles.reviewCard}>
            <Text style={styles.question}>{item.question.prompt}</Text>
            <Text style={item.correct ? styles.correct : styles.incorrect}>
              {item.correct ? t('common.correct') : t('common.needsReview')}
            </Text>
            <Text style={styles.answer}>
              {t('quizResult.yourAnswer', { answer: formatAnswer(item.user_answer) || t('common.noAnswer') })}
            </Text>
            {!item.correct ? (
              <Text style={styles.answer}>
                {t('quizResult.correctAnswer', { answer: formatAnswer(item.correct_answer) })}
              </Text>
            ) : null}
            {item.explanation ? <Text style={styles.explanation}>{item.explanation}</Text> : null}
            {item.transcript ? <Text style={styles.transcript}>{item.transcript}</Text> : null}
            {item.pinyin ? <Text style={styles.answer}>{item.pinyin}</Text> : null}
            {item.translation ? <Text style={styles.answer}>{item.translation}</Text> : null}
            {item.speech_analysis ? (
              <View style={styles.speechMetrics}>
                {item.speech_analysis.pronunciation_score != null ? (
                  <Text style={styles.answer}>
                    {t('speaking.pronunciation')}: {Math.round(item.speech_analysis.pronunciation_score)}/100
                  </Text>
                ) : null}
                {item.speech_analysis.accuracy_score != null ? (
                  <Text style={styles.answer}>
                    {t('speaking.accuracy')}: {Math.round(item.speech_analysis.accuracy_score)}/100
                  </Text>
                ) : null}
                {item.speech_analysis.fluency_score != null ? (
                  <Text style={styles.answer}>
                    {t('speaking.fluency')}: {Math.round(item.speech_analysis.fluency_score)}/100
                  </Text>
                ) : null}
                {item.speech_analysis.completeness_score != null ? (
                  <Text style={styles.answer}>
                    {t('speaking.completeness')}: {Math.round(item.speech_analysis.completeness_score)}/100
                  </Text>
                ) : null}
                {item.speech_analysis.feedback_label ? (
                  <Text style={styles.answer}>
                    {t(feedbackKeys[item.speech_analysis.feedback_label] ?? 'speaking.feedback.PRACTICE_AGAIN')}
                  </Text>
                ) : null}
              </View>
            ) : null}
            {item.writing_evaluation ? (
              <View style={styles.speechMetrics}>
                <Text style={styles.answer}>
                  {item.writing_evaluation.label === 'STRUCTURED_EVALUATION'
                    ? t('writing.structuredEvaluation')
                    : t('writing.deterministicEvaluation')}
                </Text>
                {item.writing_evaluation.criteria?.map(criterion => (
                  <Text key={criterion.key} style={styles.answer}>
                    {t(`writing.criteria.${criterion.key}` as TranslationKey)}: {criterion.passed ? t('common.pass') : t('common.needsReview')} ({Math.round(criterion.score)}%)
                  </Text>
                ))}
              </View>
            ) : null}
          </Card>
        ))}
      </View>
      <Button title={t('quizResult.backToLessons')} leftIcon="list-outline" onPress={onDone} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 80 },
  title: { ...typography.headlineLgMobile, color: colors.onSurface, marginBottom: spacing.stackLg },
  scoreCard: { alignItems: 'center', marginBottom: spacing.stackLg },
  score: { fontSize: 56, fontWeight: '700', color: colors.primary },
  detail: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackMd },
  review: { marginBottom: spacing.stackLg },
  reviewTitle: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackMd },
  reviewCard: { marginBottom: spacing.stackSm },
  question: { ...typography.bodyMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  correct: { ...typography.labelMd, color: colors.tertiary },
  incorrect: { ...typography.labelMd, color: colors.error },
  answer: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 },
  explanation: { ...typography.bodyMd, color: colors.onSurface, marginTop: spacing.stackSm },
  transcript: { ...typography.bodyZh, color: colors.onSurface, marginTop: spacing.stackSm },
  speechMetrics: { marginTop: spacing.stackSm },
});
