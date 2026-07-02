import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'QuizResult'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function QuizResultScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();

  const passed = params.score >= 70;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.emoji}>{passed ? '🎉' : '📚'}</Text>
      <Text style={styles.title}>{passed ? 'Great job!' : 'Keep practicing!'}</Text>
      <Text style={styles.lesson}>{params.lessonTitle}</Text>

      <Card style={styles.scoreCard}>
        <Text style={styles.score}>{params.score}%</Text>
        <Text style={styles.detail}>
          {params.correctCount} / {params.totalQuestions} correct
        </Text>
      </Card>

      {params.results?.length ? (
        <View style={styles.review}>
          <Text style={styles.reviewTitle}>Answer Review</Text>
          {params.results.map((result, index) => (
            <Card key={`${result.question_id}-${index}`} style={styles.resultCard}>
              <Text style={styles.question}>{result.prompt ?? `Question ${index + 1}`}</Text>
              <Text style={result.correct ? styles.correct : styles.incorrect}>
                {result.correct ? 'Correct' : 'Needs review'}
              </Text>
              <Text style={styles.answer}>Your answer: {result.user_answer || 'No answer'}</Text>
              {!result.correct && <Text style={styles.answer}>Correct answer: {result.correct_answer}</Text>}
              {result.explanation ? <Text style={styles.explanation}>{result.explanation}</Text> : null}
            </Card>
          ))}
        </View>
      ) : null}

      <Button title="Back to Lessons" onPress={() => navigation.popToTop()} />
      {params.source !== 'mock' && (
        <Button
          title="Try Again"
          variant="ghost"
          onPress={() =>
            navigation.navigate('Quiz', {
              lessonId: params.lessonId,
              lessonTitle: params.lessonTitle,
            })
          }
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
  lesson: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackLg },
  scoreCard: { width: '100%', alignItems: 'center', marginBottom: spacing.stackLg },
  score: { fontSize: 56, fontWeight: '700', color: colors.primary },
  detail: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  retry: { marginTop: spacing.stackMd },
  review: { width: '100%', marginBottom: spacing.stackLg },
  reviewTitle: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackMd },
  resultCard: { marginBottom: spacing.stackSm },
  question: { ...typography.bodyMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  correct: { ...typography.labelMd, color: colors.tertiary },
  incorrect: { ...typography.labelMd, color: colors.error },
  answer: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 },
  explanation: { ...typography.bodyMd, color: colors.onSurface, marginTop: spacing.stackSm },
});
