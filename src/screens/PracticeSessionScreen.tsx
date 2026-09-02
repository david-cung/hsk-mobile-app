import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { practiceApi } from '../api/endpoints';
import type {
  PracticeAnswer,
  PracticeAnswerResult,
  PracticeQuestion,
} from '../api/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PracticeProgress } from '../components/practice/PracticeProgress';
import { QuestionFeedback } from '../components/practice/QuestionFeedback';
import { QuestionRenderer } from '../components/practice/QuestionRenderer';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { localizeText } from '../i18n/content';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'PracticeSession' | 'WritingPractice'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

function hasAnswer(answer: PracticeAnswer | undefined): boolean {
  if (typeof answer === 'string') return Boolean(answer.trim());
  if (Array.isArray(answer)) return answer.length > 0;
  if (answer && typeof answer === 'object' && 'recording_id' in answer) {
    return typeof answer.recording_id === 'number';
  }
  return Boolean(answer && Object.keys(answer).length);
}

function idempotencyKey(sessionId: number, questionId: number): string {
  return `${sessionId}-${questionId}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function PracticeSessionScreen({
  forcedSkill,
}: {
  forcedSkill?: string;
} = {}) {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { language, t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, PracticeAnswer>>({});
  const [feedback, setFeedback] = useState<PracticeAnswerResult | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const idempotencyKeys = useRef<Record<number, string>>({});
  const startedAt = useRef<Record<number, number>>({});
  const initializedSessionId = useRef<number | null>(null);

  const {
    data: session,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['practiceSession', params.lessonId],
    queryFn: () =>
      practiceApi.startSession({
        lesson_id: params.lessonId,
        skill: forcedSkill ?? ('skill' in params ? params.skill : undefined),
        resume: true,
      }),
    retry: false,
  });

  useEffect(() => {
    if (!session || initializedSessionId.current === session.id) return;
    const answered = session.answered_question_ids ?? [];
    const firstUnanswered = session.questions.findIndex(
      question => !answered.includes(question.id),
    );
    setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : session.questions.length);
    initializedSessionId.current = session.id;
  }, [session]);

  const submitMutation = useMutation({
    mutationFn: ({
      question,
      answer,
      key,
      timeSpent,
    }: {
      question: PracticeQuestion;
      answer: PracticeAnswer;
      key: string;
      timeSpent: number;
    }) =>
      practiceApi.answer(session!.id, {
        question_id: question.id,
        answer,
        idempotency_key: key,
        time_spent_seconds: timeSpent,
      }),
    onSuccess: result => {
      setFeedback(result);
      queryClient.setQueryData(
        ['practiceSession', params.lessonId],
        (previous: typeof session) =>
          previous
            ? {
                ...previous,
                answered_questions: result.answered_questions,
                correct_answers: result.correct_answers,
                score: result.session_score,
                answered_question_ids: Array.from(
                  new Set([...(previous.answered_question_ids ?? []), result.question_id]),
                ),
              }
            : previous,
      );
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => practiceApi.complete(session!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      navigation.replace('PracticeResult', {
        sessionId: session!.id,
        lessonId: params.lessonId,
        lessonTitle: params.lessonTitle,
        lessonTitleTranslations: params.lessonTitleTranslations,
      });
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title={t('practiceSession.loading')} />
      </View>
    );
  }
  if (isError || !session) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('practiceSession.couldNotStart')}
          message={error instanceof Error ? error.message : t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => refetch()}
        />
      </View>
    );
  }
  if (!session.questions.length) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="empty"
          title={t('practiceSession.empty')}
          message={t('practiceSession.emptyMessage')}
        />
      </View>
    );
  }

  if (currentIndex >= session.questions.length) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="success"
          title={t('practiceSession.readyToFinish')}
          message={t('practiceSession.readyToFinishMessage')}
          actionLabel={t('practiceSession.viewResults')}
          onAction={() => completeMutation.mutate()}
        />
        {completeMutation.isError ? (
          <Text style={styles.error}>
            {completeMutation.error instanceof Error
              ? completeMutation.error.message
              : t('practiceSession.completeFailed')}
          </Text>
        ) : null}
      </View>
    );
  }

  const question = session.questions[currentIndex];
  const answer = answers[question.id];
  const prompt = localizeText(
    question.prompt_translations,
    language,
    question.prompt,
  );
  if (!startedAt.current[question.id]) {
    startedAt.current[question.id] = Date.now();
  }

  const submit = () => {
    if (!hasAnswer(answer)) {
      setSelectionError(t('practiceSession.answerRequired'));
      return;
    }
    setSelectionError(null);
    const key =
      idempotencyKeys.current[question.id] ??
      idempotencyKey(session.id, question.id);
    idempotencyKeys.current[question.id] = key;
    submitMutation.mutate({
      question,
      answer: answer!,
      key,
      timeSpent: Math.max(
        0,
        Math.round((Date.now() - startedAt.current[question.id]) / 1000),
      ),
    });
  };

  const next = () => {
    setFeedback(null);
    setSelectionError(null);
    setCurrentIndex(index => index + 1);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PracticeProgress
        current={currentIndex + 1}
        total={session.questions.length}
      />
      <Card>
        {question.instruction ? (
          <Text style={styles.instruction}>{question.instruction}</Text>
        ) : null}
        <Text style={styles.prompt}>{prompt}</Text>
        <QuestionRenderer
          question={question}
          answer={answer}
          disabled={Boolean(feedback) || submitMutation.isPending}
          onChange={value => {
            setSelectionError(null);
            setAnswers(previous => ({ ...previous, [question.id]: value }));
          }}
        />
      </Card>
      {selectionError ? <Text style={styles.error}>{selectionError}</Text> : null}
      {submitMutation.isError ? (
        <ScreenState
          type="error"
          title={t('practiceSession.submitFailed')}
          message={
            submitMutation.error instanceof Error
              ? submitMutation.error.message
              : t('common.connectionRetry')
          }
          actionLabel={t('common.tryAgain')}
          onAction={submit}
          compact
          style={styles.feedback}
        />
      ) : null}
      {completeMutation.isError ? (
        <ScreenState
          type="error"
          title={t('practiceSession.completeFailed')}
          message={
            completeMutation.error instanceof Error
              ? completeMutation.error.message
              : t('common.connectionRetry')
          }
          actionLabel={t('common.tryAgain')}
          onAction={() => completeMutation.mutate()}
          compact
          style={styles.feedback}
        />
      ) : null}
      {feedback ? (
        <QuestionFeedback result={feedback} />
      ) : null}
      <Button
        title={
          feedback
            ? currentIndex === session.questions.length - 1
              ? t('practiceSession.finish')
              : t('practiceSession.next')
            : t('practiceSession.submit')
        }
        rightIcon={feedback ? 'arrow-forward' : 'checkmark-circle-outline'}
        onPress={
          feedback
            ? currentIndex === session.questions.length - 1
              ? () => completeMutation.mutate()
              : next
            : submit
        }
        loading={submitMutation.isPending || completeMutation.isPending}
        disabled={submitMutation.isPending || completeMutation.isPending}
        style={styles.action}
      />
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
  instruction: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackSm,
  },
  prompt: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackLg,
  },
  error: {
    ...typography.labelMd,
    color: colors.error,
    marginTop: spacing.stackMd,
  },
  feedback: { marginTop: spacing.stackLg },
  action: { marginTop: spacing.stackLg },
});
