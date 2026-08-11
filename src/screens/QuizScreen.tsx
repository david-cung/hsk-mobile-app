import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { contentApi, quizApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { getQuestionOptionLabel, getQuestionPrompt } from '../i18n/content';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'Quiz'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function QuizScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { language, t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: questions,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['questions', params.lessonId],
    queryFn: () => contentApi.questions(params.lessonId),
  });

  const submitMutation = useMutation({
    mutationFn: () => quizApi.submit(params.lessonId, answers),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      navigation.replace('QuizResult', {
        lessonId: params.lessonId,
        lessonTitle: params.lessonTitle,
        lessonTitleTranslations: params.lessonTitleTranslations,
        score: result.score,
        correctCount: result.correct_count,
        totalQuestions: result.total_questions,
        results: result.results,
        source: 'lesson',
      });
    },
    onError: (e) => setSubmitError(e instanceof Error ? e.message : t('quiz.submitFailed')),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title={t('quiz.loading')} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('quiz.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => {
            refetch();
          }}
        />
      </View>
    );
  }

  if (!questions?.length) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="empty"
          title={t('quiz.noQuestions')}
          message={t('quiz.noQuestionsMessage')}
        />
      </View>
    );
  }

  const question = questions[currentIndex];
  const selected = answers[String(question.id)];
  const isLast = currentIndex === questions.length - 1;
  const hasOptions = Boolean(question.options?.length);

  const handleSelect = (option: string) => {
    setSelectionError(null);
    setSubmitError(null);
    setAnswers((prev) => ({ ...prev, [String(question.id)]: option }));
  };

  const handleNext = () => {
    if (!selected) {
      setSelectionError(t('quiz.chooseOption'));
      return;
    }
    if (isLast) {
      submitMutation.mutate();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.progress}>
        {t('quiz.progress', { current: currentIndex + 1, total: questions.length })}
      </Text>
      <ProgressBar progress={((currentIndex + 1) / questions.length) * 100} />
      <Card>
        <Text style={styles.prompt}>{getQuestionPrompt(question, language)}</Text>
        {hasOptions ? (
          question.options?.map((option, optionIndex) => {
            const optionLabel = getQuestionOptionLabel(question, option, optionIndex, language);
            return (
            <Pressable
              key={option}
              style={[styles.option, selected === option && styles.optionSelected]}
              onPress={() => handleSelect(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selected === option }}
              accessibilityLabel={optionLabel}
            >
              <Text style={[styles.optionText, selected === option && styles.optionTextSelected]}>
                {optionLabel}
              </Text>
            </Pressable>
            );
          })
        ) : (
          <TextInput
            value={selected ?? ''}
            onChangeText={(text) => handleSelect(text)}
            placeholder={t('quiz.answerPlaceholder')}
            placeholderTextColor={colors.onSurfaceVariant}
            autoCapitalize="none"
            style={styles.answerInput}
          />
        )}
      </Card>
      {selectionError ? <Text style={styles.errorText}>{selectionError}</Text> : null}
      {submitError ? (
        <ScreenState type="error" title={t('quiz.couldNotSubmit')} message={submitError} compact style={styles.errorState} />
      ) : null}
      <View style={styles.actions}>
        <Button
          title={t('common.previous')}
          variant="ghost"
          disabled={currentIndex === 0 || submitMutation.isPending}
          onPress={() => {
            setSelectionError(null);
            setCurrentIndex((index) => Math.max(0, index - 1));
          }}
          style={styles.actionButton}
        />
        <Button
          title={isLast ? t('quiz.submitQuiz') : t('quiz.nextQuestion')}
          rightIcon={isLast ? 'checkmark-circle-outline' : 'arrow-forward'}
          onPress={handleNext}
          loading={submitMutation.isPending}
          disabled={submitMutation.isPending}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
  progress: { ...typography.labelMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackMd },
  prompt: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackLg, marginTop: spacing.stackMd },
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
  answerInput: {
    ...typography.bodyMd,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderRadius: radius.lg,
    padding: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLow,
  },
  errorText: { ...typography.labelMd, color: colors.error, marginTop: spacing.stackMd },
  errorState: { marginTop: spacing.stackMd },
  actions: { flexDirection: 'row', gap: spacing.stackMd, marginTop: spacing.stackLg },
  actionButton: { flex: 1 },
});
