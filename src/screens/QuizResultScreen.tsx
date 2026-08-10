import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { useI18n } from '../i18n/I18nContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'QuizResult'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function QuizResultScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { t, formatNumber } = useI18n();

  const passed = params.score >= 60;
  const canRetryMock =
    params.source === 'mock' &&
    params.mockTestId != null &&
    params.hskLevel != null &&
    params.durationMinutes != null;
  const canRetry = params.source !== 'mock' || canRetryMock;

  const retry = () => {
    if (params.source === 'mock') {
      const { mockTestId, hskLevel, durationMinutes } = params;
      if (mockTestId == null || hskLevel == null || durationMinutes == null) {
        return;
      }
      navigation.navigate('MockTestSession', {
        mockTestId,
        title: params.lessonTitle,
        hskLevel,
        durationMinutes,
      });
      return;
    }

    navigation.navigate('Quiz', {
      lessonId: params.lessonId,
      lessonTitle: params.lessonTitle,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.emoji}>{passed ? '🎉' : '📚'}</Text>
      <Text style={styles.title}>
        {passed ? t('quizResult.greatJob') : t('quizResult.keepPracticing')}
      </Text>
      <Text style={styles.lesson}>{params.lessonTitle}</Text>

      <Card style={styles.scoreCard}>
        <Text style={styles.score}>{params.score}%</Text>
        <Text style={styles.detail}>
          {t('quizResult.correctCount', {
            correct: formatNumber(params.correctCount),
            total: formatNumber(params.totalQuestions),
          })}
        </Text>
        <View style={styles.scoreProgress}>
          <ProgressBar
            progress={params.score}
            color={passed ? colors.tertiaryContainer : colors.error}
          />
        </View>
      </Card>

      {params.results?.length ? (
        <View style={styles.review}>
          <Text style={styles.reviewTitle}>{t('quizResult.answerReview')}</Text>
          {params.results.map((result, index) => (
            <Card
              key={`${result.question_id}-${index}`}
              style={styles.resultCard}
            >
              <Text style={styles.question}>
                {result.prompt ?? t('quiz.progress', { current: index + 1, total: params.totalQuestions })}
              </Text>
              <Text style={result.correct ? styles.correct : styles.incorrect}>
                {result.correct ? t('common.correct') : t('common.needsReview')}
              </Text>
              <Text style={styles.answer}>
                {t('quizResult.yourAnswer', { answer: result.user_answer || t('common.noAnswer') })}
              </Text>
              {!result.correct && (
                <Text style={styles.answer}>
                  {t('quizResult.correctAnswer', { answer: result.correct_answer })}
                </Text>
              )}
              {result.explanation ? (
                <Text style={styles.explanation}>{result.explanation}</Text>
              ) : null}
            </Card>
          ))}
        </View>
      ) : null}

      <Button
        title={t('quizResult.backToLessons')}
        leftIcon="list-outline"
        onPress={() => navigation.popToTop()}
      />
      {canRetry && (
        <Button
          title={t('quizResult.tryAgain')}
          variant="ghost"
          leftIcon="refresh-outline"
          onPress={retry}
          style={styles.retry}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.marginMobile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 64, marginBottom: spacing.stackMd },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  lesson: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackLg,
  },
  scoreCard: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.stackLg,
  },
  score: { fontSize: 56, fontWeight: '700', color: colors.primary },
  detail: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
  },
  scoreProgress: { width: '100%', marginTop: spacing.stackMd },
  retry: { marginTop: spacing.stackMd },
  review: { width: '100%', marginBottom: spacing.stackLg },
  reviewTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
  },
  resultCard: { marginBottom: spacing.stackSm },
  question: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginBottom: spacing.stackSm,
  },
  correct: { ...typography.labelMd, color: colors.tertiary },
  incorrect: { ...typography.labelMd, color: colors.error },
  answer: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  explanation: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginTop: spacing.stackSm,
  },
});
