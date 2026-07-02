import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(params.durationMinutes * 60);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['mockTestQuestions', params.mockTestId],
    queryFn: () => learningApi.mockTestQuestions(params.mockTestId),
  });

  const submitMutation = useMutation({
    mutationFn: () => learningApi.submitMockTest(params.mockTestId, answers),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigation.replace('QuizResult', {
        lessonId: params.mockTestId,
        lessonTitle: params.title,
        score: result.score,
        correctCount: result.correct_count,
        totalQuestions: result.total_questions,
        results: result.results,
        source: 'mock',
      });
    },
    onError: (e) => Alert.alert('Error', e instanceof Error ? e.message : 'Submit failed'),
  });
  const { mutate: submitAnswers, isPending: isSubmitting, isSuccess: isSubmitted } = submitMutation;

  useEffect(() => {
    if (isSubmitting || isSubmitted) return undefined;
    const timer = setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          clearInterval(timer);
          submitAnswers();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, isSubmitting, submitAnswers]);

  const question = questions?.[currentIndex];
  const selected = question ? answers[String(question.id)] : undefined;
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  if (isLoading || !questions?.length || !question) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const submit = () => {
    if (answeredCount < questions.length) {
      Alert.alert('Submit mock test?', `${questions.length - answeredCount} questions are unanswered.`, [
        { text: 'Continue', style: 'cancel' },
        { text: 'Submit', onPress: () => submitAnswers() },
      ]);
      return;
    }
    submitAnswers();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.meta}>HSK {params.hskLevel} Mock Test</Text>
        <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      </View>
      <Text style={styles.progress}>
        Question {currentIndex + 1} of {questions.length} · {answeredCount} answered
      </Text>

      <Card>
        <Text style={styles.lesson}>{question.lesson_title}</Text>
        <Text style={styles.prompt}>{question.prompt}</Text>
        {question.options?.map((option) => (
          <Pressable
            key={option}
            style={[styles.option, selected === option && styles.optionSelected]}
            onPress={() => setAnswers((prev) => ({ ...prev, [String(question.id)]: option }))}
          >
            <Text style={[styles.optionText, selected === option && styles.optionTextSelected]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </Card>

      <View style={styles.actions}>
        <Button
          title="Previous"
          variant="ghost"
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          style={styles.actionButton}
        />
        {currentIndex === questions.length - 1 ? (
          <Button
            title="Submit"
            onPress={submit}
            loading={isSubmitting}
            style={styles.actionButton}
          />
        ) : (
          <Button
            title="Next"
            onPress={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { ...typography.labelMd, color: colors.onSurfaceVariant },
  timer: { ...typography.headlineMd, color: colors.primary },
  progress: { ...typography.labelMd, color: colors.onSurfaceVariant, marginVertical: spacing.stackMd },
  lesson: { ...typography.labelSm, color: colors.tertiary, marginBottom: spacing.stackSm },
  prompt: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackLg },
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
  actions: { flexDirection: 'row', gap: spacing.stackMd, marginTop: spacing.stackLg },
  actionButton: { flex: 1 },
});
