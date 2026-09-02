import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { practiceApi } from '../api/endpoints';
import type { PracticeAnswerResult, PracticeResults } from '../api/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { AudioPlaybackState } from '../components/audio/AudioPlayer';
import { PracticeProgress } from '../components/practice/PracticeProgress';
import { PracticeResult } from '../components/practice/PracticeResult';
import { PracticeAnswer, QuestionRenderer } from '../components/practice/QuestionRenderer';
import { QuestionFeedback } from '../components/practice/QuestionFeedback';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { localizeText } from '../i18n/content';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'PracticeSession'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

function hasAnswer(answer: PracticeAnswer) {
  if (Array.isArray(answer)) {
    return answer.length > 0;
  }
  if (answer && typeof answer === 'object') {
    return typeof answer.recording_id === 'number';
  }
  return String(answer ?? '').trim().length > 0;
}

export function PracticeSessionScreen({ forcedSkill }: { forcedSkill?: string } = {}) {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { language, t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<PracticeAnswer>('');
  const [feedback, setFeedback] = useState<PracticeAnswerResult | null>(null);
  const [results, setResults] = useState<PracticeResults | null>(null);
  const [submitKey, setSubmitKey] = useState(() => `${Date.now()}-0`);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [playback, setPlayback] = useState<AudioPlaybackState | null>(null);
  const skill = forcedSkill ?? params.skill;

  const sessionQuery = useQuery({
    queryKey: ['practice-session-start', params.lessonId, skill],
    queryFn: () => practiceApi.createSession({ lesson_id: params.lessonId, skill, resume: true }),
  });

  const session = feedback?.session ?? sessionQuery.data;
  const questions = session?.questions ?? [];
  const question = questions[currentIndex];
  const lessonTitle = localizeText(params.lessonTitleTranslations, language, params.lessonTitle);

  const answerMutation = useMutation({
    mutationFn: () => {
      if (!session || !question) {
        throw new Error(t('practice.sessionExpired'));
      }
      return practiceApi.submitAnswer(session.id, {
        question_id: question.id,
        answer,
        time_spent_seconds: Math.max(0, Math.round((Date.now() - questionStartedAt) / 1000)),
        idempotency_key: submitKey,
        playback: playback ?? undefined,
      });
    },
    onSuccess: data => {
      setFeedback(data);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error(t('practice.sessionExpired'));
      }
      await practiceApi.complete(session.id);
      return practiceApi.results(session.id);
    },
    onSuccess: data => {
      setResults(data);
    },
  });

  if (results) {
    return <PracticeResult results={results} onDone={() => navigation.popToTop()} />;
  }

  if (sessionQuery.isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title={t('practice.loadingSession')} />
      </View>
    );
  }

  if (sessionQuery.isError) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('practice.couldNotStart')}
          message={sessionQuery.error instanceof Error ? sessionQuery.error.message : t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => sessionQuery.refetch()}
        />
      </View>
    );
  }

  if (!session || !question) {
    return (
      <View style={styles.center}>
        <ScreenState type="empty" title={t('practice.noQuestions')} message={t('quiz.noQuestionsMessage')} />
      </View>
    );
  }

  const isLast = currentIndex === questions.length - 1;
  const isSubmitted = Boolean(feedback && feedback.question_id === question.id);

  const moveNext = () => {
    if (isLast) {
      completeMutation.mutate();
      return;
    }
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setAnswer('');
    setFeedback(null);
    setPlayback(null);
    setSubmitKey(`${Date.now()}-${nextIndex}`);
    setQuestionStartedAt(Date.now());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lesson}>{lessonTitle}</Text>
      <PracticeProgress current={currentIndex + 1} total={questions.length} />
      <Card style={styles.card}>
        {question.instruction ? <Text style={styles.instruction}>{question.instruction}</Text> : null}
        <Text style={styles.prompt}>{question.prompt}</Text>
        <QuestionRenderer
          question={question}
          answer={answer}
          disabled={isSubmitted || answerMutation.isPending || completeMutation.isPending}
          onChange={nextAnswer => {
            setAnswer(nextAnswer);
            setFeedback(null);
          }}
          onPlaybackChange={setPlayback}
        />
        {feedback ? (
          <QuestionFeedback
            correct={feedback.correct}
            correctAnswer={feedback.correct_answer}
            explanation={feedback.explanation}
            transcript={feedback.transcript}
            pinyin={feedback.pinyin}
            translation={feedback.translation}
            processingStatus={feedback.processing_status}
            speechAnalysis={feedback.speech_analysis}
            writingEvaluation={feedback.writing_evaluation}
          />
        ) : null}
      </Card>
      {answerMutation.isError ? (
        <ScreenState
          type="error"
          title={t('practice.couldNotSubmit')}
          message={answerMutation.error instanceof Error ? answerMutation.error.message : t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => answerMutation.mutate()}
          compact
          style={styles.inlineState}
        />
      ) : null}
      {completeMutation.isError ? (
        <ScreenState
          type="error"
          title={t('practice.couldNotComplete')}
          message={completeMutation.error instanceof Error ? completeMutation.error.message : t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => completeMutation.mutate()}
          compact
          style={styles.inlineState}
        />
      ) : null}
      <View style={styles.actions}>
        <Button
          title={t('common.previous')}
          variant="ghost"
          disabled={currentIndex === 0 || answerMutation.isPending || completeMutation.isPending}
          onPress={() => {
            const previousIndex = Math.max(0, currentIndex - 1);
            setCurrentIndex(previousIndex);
            setAnswer('');
            setFeedback(null);
            setPlayback(null);
            setSubmitKey(`${Date.now()}-${previousIndex}`);
            setQuestionStartedAt(Date.now());
          }}
          style={styles.actionButton}
        />
        {isSubmitted ? (
          <Button
            title={isLast ? t('practice.finish') : t('quiz.nextQuestion')}
            rightIcon={isLast ? 'checkmark-circle-outline' : 'arrow-forward'}
            loading={completeMutation.isPending}
            disabled={completeMutation.isPending}
            onPress={moveNext}
            style={styles.actionButton}
          />
        ) : (
          <Button
            title={t('common.check')}
            rightIcon="checkmark-circle-outline"
            loading={answerMutation.isPending}
            disabled={!hasAnswer(answer) || answerMutation.isPending}
            onPress={() => answerMutation.mutate()}
            style={styles.actionButton}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 80 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
  lesson: { ...typography.labelMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackMd },
  card: { marginTop: spacing.stackLg },
  instruction: { ...typography.labelMd, color: colors.tertiary, marginBottom: spacing.stackSm },
  prompt: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackLg },
  inlineState: { marginTop: spacing.stackMd },
  actions: { flexDirection: 'row', gap: spacing.stackMd, marginTop: spacing.stackLg },
  actionButton: { flex: 1 },
});
