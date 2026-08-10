import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { learningApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'MockTestSession'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
}

export function MockTestSessionScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(params.durationMinutes * 60);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: questions,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['mockTestQuestions', params.mockTestId],
    queryFn: () => learningApi.mockTestQuestions(params.mockTestId),
  });

  const submitMutation = useMutation({
    mutationFn: () => learningApi.submitMockTest(params.mockTestId, answers),
    onSuccess: result => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigation.replace('QuizResult', {
        lessonId: params.mockTestId,
        lessonTitle: params.title,
        score: result.score,
        correctCount: result.correct_count,
        totalQuestions: result.total_questions,
        results: result.results,
        source: 'mock',
        mockTestId: params.mockTestId,
        hskLevel: params.hskLevel,
        durationMinutes: params.durationMinutes,
      });
    },
    onError: e =>
      setSubmitError(e instanceof Error ? e.message : t('quiz.submitFailed')),
  });
  const {
    mutate: submitAnswers,
    isPending: isSubmitting,
    isSuccess: isSubmitted,
  } = submitMutation;

  useEffect(() => {
    if (isLoading || !questions?.length || isSubmitting || isSubmitted)
      return undefined;
    const timer = setInterval(() => {
      setSecondsLeft(value => {
        if (value <= 1) {
          clearInterval(timer);
          submitAnswers();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading, isSubmitted, isSubmitting, questions?.length, submitAnswers]);

  const question = questions?.[currentIndex];
  const selected = question ? answers[String(question.id)] : undefined;
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title={t('mockSession.loading')} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('mockSession.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => {
            refetch();
          }}
        />
      </View>
    );
  }

  if (!questions?.length || !question) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="empty"
          title={t('mockSession.noQuestions')}
          message={t('mockSession.noQuestionsMessage')}
        />
      </View>
    );
  }

  const submit = () => {
    if (answeredCount < questions.length) {
      Alert.alert(
        t('mockSession.submitQuestion'),
        t('mockSession.unanswered', { count: questions.length - answeredCount }),
        [
          { text: t('common.continue'), style: 'cancel' },
          {
            text: t('common.submit'),
            onPress: () => {
              setSubmitError(null);
              submitAnswers();
            },
          },
        ],
      );
      return;
    }
    setSubmitError(null);
    submitAnswers();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.meta}>{t('mockSession.hskTitle', { level: params.hskLevel })}</Text>
        <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      </View>
      <Text style={styles.progress}>
        {t('mockSession.progress', {
          current: currentIndex + 1,
          total: questions.length,
          answered: answeredCount,
        })}
      </Text>
      <ProgressBar progress={((currentIndex + 1) / questions.length) * 100} />

      <Card>
        <Text style={styles.lesson}>{question.lesson_title}</Text>
        <Text style={styles.prompt}>{question.prompt}</Text>
        {question.options?.map(option => (
          <Pressable
            key={option}
            style={[
              styles.option,
              selected === option && styles.optionSelected,
            ]}
            onPress={() => {
              setSubmitError(null);
              setAnswers(prev => ({ ...prev, [String(question.id)]: option }));
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: selected === option }}
            accessibilityLabel={option}
          >
            <Text
              style={[
                styles.optionText,
                selected === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </Card>
      {submitError ? (
        <ScreenState
          type="error"
          title={t('mockSession.couldNotSubmit')}
          message={submitError}
          compact
          style={styles.errorState}
        />
      ) : null}

      <View style={styles.actions}>
        <Button
          title={t('common.previous')}
          variant="ghost"
          disabled={currentIndex === 0 || isSubmitting}
          onPress={() => setCurrentIndex(index => Math.max(0, index - 1))}
          style={styles.actionButton}
        />
        {currentIndex === questions.length - 1 ? (
          <Button
            title={t('common.submit')}
            rightIcon="checkmark-circle-outline"
            onPress={submit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.actionButton}
          />
        ) : (
          <Button
            title={t('common.next')}
            rightIcon="arrow-forward"
            onPress={() =>
              setCurrentIndex(index =>
                Math.min(questions.length - 1, index + 1),
              )
            }
            style={styles.actionButton}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.marginMobile,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: { ...typography.labelMd, color: colors.onSurfaceVariant },
  timer: { ...typography.headlineMd, color: colors.primary },
  progress: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginVertical: spacing.stackMd,
  },
  lesson: {
    ...typography.labelSm,
    color: colors.tertiary,
    marginBottom: spacing.stackSm,
    marginTop: spacing.stackMd,
  },
  prompt: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackLg,
  },
  option: {
    padding: spacing.stackMd,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    marginBottom: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLow,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFixed,
  },
  optionText: { ...typography.bodyMd, color: colors.onSurface },
  optionTextSelected: { color: colors.primary, fontWeight: '600' },
  errorState: { marginTop: spacing.stackMd },
  actions: {
    flexDirection: 'row',
    gap: spacing.stackMd,
    marginTop: spacing.stackLg,
  },
  actionButton: { flex: 1 },
});
