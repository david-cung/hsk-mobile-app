import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { examApi } from '../api/endpoints';
import type { ExamAttempt } from '../api/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { AudioPlaybackState } from '../components/audio/AudioPlayer';
import { PracticeAnswer, QuestionRenderer } from '../components/practice/QuestionRenderer';
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

function hasAnswer(answer: unknown) {
  if (Array.isArray(answer)) return answer.length > 0;
  if (answer && typeof answer === 'object') return Object.keys(answer).length > 0;
  return String(answer ?? '').trim().length > 0;
}

function initialAnswer(attempt?: ExamAttempt, questionId?: number): PracticeAnswer {
  if (!attempt || !questionId) return '';
  const saved = attempt.answers[String(questionId)];
  return (saved ?? '') as PracticeAnswer;
}

export function MockTestSessionScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { t, formatNumber } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<string, PracticeAnswer>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [playback, setPlayback] = useState<AudioPlaybackState | null>(null);

  const startQuery = useQuery({
    queryKey: ['exam-start', params.examId],
    queryFn: () => examApi.start(params.examId!),
    enabled: Boolean(params.examId && !params.attemptId),
  });
  const resumeQuery = useQuery({
    queryKey: ['exam-attempt', params.attemptId ?? startQuery.data?.attempt_id],
    queryFn: () => examApi.attempt(params.attemptId ?? startQuery.data!.attempt_id),
    enabled: Boolean(params.attemptId || startQuery.data?.attempt_id),
    refetchInterval: 30000,
  });
  const attempt = resumeQuery.data ?? startQuery.data;
  const questions = useMemo(() => attempt?.questions ?? [], [attempt?.questions]);
  const question = questions[currentIndex];
  const selected = question ? localAnswers[String(question.id)] ?? initialAnswer(attempt, question.id) : '';

  useEffect(() => {
    if (!attempt) return;
    const update = () => setSecondsLeft(Math.max(0, Math.round((new Date(attempt.expires_at).getTime() - Date.now()) / 1000)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [attempt]);

  const saveMutation = useMutation({
    mutationFn: ({ questionId, answer }: { questionId: number; answer: PracticeAnswer }) =>
      examApi.saveAnswer(attempt!.attempt_id, questionId, answer, `exam:${attempt!.attempt_id}:${questionId}`),
    onSuccess: data => {
      queryClient.setQueryData(['exam-attempt', data.attempt_id], data);
    },
  });
  const submitMutation = useMutation({
    mutationFn: () => examApi.submit(attempt!.attempt_id),
    onSuccess: result => {
      queryClient.invalidateQueries({ queryKey: ['exam-history'] });
      queryClient.invalidateQueries({ queryKey: ['progress-summary'] });
      navigation.replace('MockExamResult', { attemptId: result.attempt_id });
    },
  });

  useEffect(() => {
    if (attempt?.status === 'EXPIRED' || attempt?.status === 'SUBMITTED') {
      navigation.replace('MockExamResult', { attemptId: attempt.attempt_id });
    }
  }, [attempt?.attempt_id, attempt?.status, navigation]);

  useEffect(() => {
    if (attempt && secondsLeft === 0 && attempt.status === 'IN_PROGRESS' && !submitMutation.isPending) {
      submitMutation.mutate();
    }
  }, [attempt, secondsLeft, submitMutation]);

  const answeredCount = useMemo(() => {
    const merged = { ...(attempt?.answers ?? {}), ...localAnswers };
    return questions.filter(item => hasAnswer(merged[String(item.id)])).length;
  }, [attempt?.answers, localAnswers, questions]);

  if (startQuery.isLoading || resumeQuery.isLoading) {
    return <View style={styles.center}><ScreenState type="loading" title={t('mockSession.loading')} /></View>;
  }
  if (startQuery.isError || resumeQuery.isError || !attempt || !question) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('mockSession.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => {
            startQuery.refetch();
            resumeQuery.refetch();
          }}
        />
      </View>
    );
  }

  const submit = () => {
    const unanswered = questions.length - answeredCount;
    Alert.alert(t('mockSession.submitQuestion'), t('mockSession.unanswered', { count: formatNumber(unanswered) }), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.submit'), onPress: () => submitMutation.mutate() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.meta}>{question.section}{question.part_title ? ` · ${question.part_title}` : ''}</Text>
        <Text style={[styles.timer, secondsLeft < 60 && styles.timerUrgent]}>{formatTime(secondsLeft)}</Text>
      </View>
      <Text style={styles.progress}>{t('mockSession.progress', { current: currentIndex + 1, total: questions.length, answered: answeredCount })}</Text>
      <ProgressBar progress={((currentIndex + 1) / questions.length) * 100} />

      <View style={styles.navigator}>
        {questions.map((item, index) => {
          const answered = hasAnswer(localAnswers[String(item.id)] ?? attempt.answers[String(item.id)]);
          return (
            <Pressable key={item.id} accessibilityRole="button" onPress={() => setCurrentIndex(index)} style={[styles.navDot, currentIndex === index && styles.navDotActive, answered && styles.navDotAnswered]}>
              <Text style={styles.navText}>{index + 1}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card style={styles.card}>
        {question.instruction ? <Text style={styles.instruction}>{question.instruction}</Text> : null}
        <Text style={styles.prompt}>{question.prompt}</Text>
        <QuestionRenderer
          question={question}
          answer={selected}
          disabled={saveMutation.isPending || submitMutation.isPending || secondsLeft <= 0}
          onChange={answer => {
            setLocalAnswers(prev => ({ ...prev, [String(question.id)]: answer }));
            saveMutation.mutate({ questionId: question.id, answer });
          }}
          onPlaybackChange={setPlayback}
        />
        {playback ? null : null}
      </Card>

      {saveMutation.isError ? <ScreenState type="error" title={t('mockSession.autosaveFailed')} message={t('common.connectionRetry')} compact style={styles.inlineState} /> : null}
      {submitMutation.isError ? <ScreenState type="error" title={t('mockSession.couldNotSubmit')} message={t('common.connectionRetry')} compact style={styles.inlineState} /> : null}

      <View style={styles.actions}>
        <Button title={t('common.previous')} variant="ghost" disabled={currentIndex === 0} onPress={() => setCurrentIndex(index => Math.max(0, index - 1))} style={styles.actionButton} />
        {currentIndex === questions.length - 1 ? (
          <Button title={t('common.submit')} rightIcon="checkmark-circle-outline" loading={submitMutation.isPending} disabled={submitMutation.isPending} onPress={submit} style={styles.actionButton} />
        ) : (
          <Button title={t('common.next')} rightIcon="arrow-forward" onPress={() => setCurrentIndex(index => Math.min(questions.length - 1, index + 1))} style={styles.actionButton} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 80 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { ...typography.labelMd, color: colors.onSurfaceVariant },
  timer: { ...typography.headlineMd, color: colors.primary },
  timerUrgent: { color: colors.error },
  progress: { ...typography.labelMd, color: colors.onSurfaceVariant, marginVertical: spacing.stackMd },
  navigator: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: spacing.stackMd },
  navDot: { width: 34, height: 34, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceContainerLow },
  navDotActive: { borderWidth: 2, borderColor: colors.primary },
  navDotAnswered: { backgroundColor: colors.secondaryContainer },
  navText: { ...typography.labelSm, color: colors.onSurface },
  card: { marginTop: spacing.stackMd },
  instruction: { ...typography.labelMd, color: colors.tertiary, marginBottom: spacing.stackSm },
  prompt: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackLg },
  inlineState: { marginTop: spacing.stackMd },
  actions: { flexDirection: 'row', gap: spacing.stackMd, marginTop: spacing.stackLg },
  actionButton: { flex: 1 },
});
