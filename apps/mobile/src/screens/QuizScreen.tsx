import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { contentApi, quizApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'Quiz'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function QuizScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: questions, isLoading } = useQuery({
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
        score: result.score,
        correctCount: result.correct_count,
        totalQuestions: result.total_questions,
      });
    },
    onError: (e) => Alert.alert('Error', e instanceof Error ? e.message : 'Submit failed'),
  });

  if (isLoading || !questions?.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const question = questions[currentIndex];
  const selected = answers[String(question.id)];
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [String(question.id)]: option }));
  };

  const handleNext = () => {
    if (!selected) {
      Alert.alert('Select an answer', 'Please choose an option before continuing.');
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
        Question {currentIndex + 1} of {questions.length}
      </Text>
      <Card>
        <Text style={styles.prompt}>{question.prompt}</Text>
        {question.options?.map((option) => (
          <Pressable
            key={option}
            style={[styles.option, selected === option && styles.optionSelected]}
            onPress={() => handleSelect(option)}
          >
            <Text style={[styles.optionText, selected === option && styles.optionTextSelected]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </Card>
      <Button
        title={isLast ? 'Submit Quiz' : 'Next Question'}
        onPress={handleNext}
        loading={submitMutation.isPending}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  progress: { ...typography.labelMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackMd },
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
});
