import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { examApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'MockExamResult'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatAnswer(value: unknown) {
  if (Array.isArray(value)) return value.join(', ');
  if (value && typeof value === 'object') return JSON.stringify(value);
  return String(value ?? '');
}

export function MockExamResultScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { t, formatNumber } = useI18n();
  const resultQuery = useQuery({ queryKey: ['exam-result', params.attemptId], queryFn: () => examApi.result(params.attemptId) });

  if (resultQuery.isLoading) {
    return <View style={styles.center}><ScreenState type="loading" title={t('mockResult.loading')} /></View>;
  }
  if (resultQuery.isError || !resultQuery.data) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('mockResult.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => resultQuery.refetch()}
        />
      </View>
    );
  }

  const result = resultQuery.data;
  const correct = result.questions.filter(question => question.correct).length;
  const answered = result.questions.filter(question => question.user_answer != null && formatAnswer(question.user_answer).length > 0).length;
  const skipped = result.questions.length - answered;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{result.title}</Text>
      <Card style={styles.scoreCard}>
        <Text style={styles.score}>{formatNumber(Math.round(result.percentage))}%</Text>
        <Text style={styles.detail}>{result.score_label}: {formatNumber(result.raw_score)} / {formatNumber(result.total_points)}</Text>
        <ProgressBar progress={result.percentage} />
        <Text style={styles.detail}>
          {t('mockResult.questionStats', {
            correct: formatNumber(correct),
            incorrect: formatNumber(answered - correct),
            skipped: formatNumber(skipped),
          })}
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>{t('mockResult.sections')}</Text>
      {result.sections.map(section => (
        <Card key={section.section} style={styles.card}>
          <Text style={styles.cardTitle}>{section.section}</Text>
          <Text style={styles.detail}>{section.correct} / {section.total_questions} · {formatNumber(Math.round(section.percentage))}%</Text>
          <ProgressBar progress={section.percentage} />
        </Card>
      ))}

      {result.weak_areas.length ? (
        <>
          <Text style={styles.sectionTitle}>{t('progress.weakAreas')}</Text>
          {result.weak_areas.map(area => (
            <Card key={`${area.type}-${area.label}`} style={styles.card}>
              <Text style={styles.cardTitle}>{area.label}</Text>
              <Text style={styles.detail}>{area.reason}</Text>
            </Card>
          ))}
        </>
      ) : null}

      {result.recommended_practice.length ? (
        <>
          <Text style={styles.sectionTitle}>{t('progress.recommendedPractice')}</Text>
          {result.recommended_practice.map(item => (
            <Card key={`${item.type}-${item.target_label}`} style={styles.card}>
              <Text style={styles.cardTitle}>{item.target_label ?? item.type}</Text>
              <Text style={styles.detail}>{item.reason}</Text>
            </Card>
          ))}
        </>
      ) : null}

      <Text style={styles.sectionTitle}>{t('quizResult.answerReview')}</Text>
      {result.questions.map((question, index) => (
        <Card key={`${question.question_id}-${index}`} style={styles.card}>
          <Text style={styles.question}>{question.prompt}</Text>
          <Text style={question.correct ? styles.correct : styles.incorrect}>
            {question.correct ? t('common.correct') : t('common.needsReview')}
          </Text>
          <Text style={styles.detail}>{t('quizResult.yourAnswer', { answer: formatAnswer(question.user_answer) || t('common.noAnswer') })}</Text>
          {!question.correct ? <Text style={styles.detail}>{t('quizResult.correctAnswer', { answer: formatAnswer(question.correct_answer) })}</Text> : null}
          {question.explanation ? <Text style={styles.explanation}>{question.explanation}</Text> : null}
        </Card>
      ))}

      <Button title={t('nav.mockTests')} leftIcon="list-outline" onPress={() => navigation.navigate('MockTests')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 80 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
  title: { ...typography.headlineLgMobile, color: colors.onSurface, marginBottom: spacing.stackLg },
  scoreCard: { alignItems: 'center', marginBottom: spacing.stackLg },
  score: { fontSize: 56, fontWeight: '700', color: colors.primary },
  detail: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  sectionTitle: { ...typography.headlineMd, color: colors.onSurface, marginVertical: spacing.stackMd },
  card: { marginBottom: spacing.stackSm },
  cardTitle: { ...typography.headlineMd, color: colors.onSurface },
  question: { ...typography.bodyMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  correct: { ...typography.labelMd, color: colors.tertiary },
  incorrect: { ...typography.labelMd, color: colors.error },
  explanation: { ...typography.bodyMd, color: colors.onSurface, marginTop: spacing.stackSm },
});
