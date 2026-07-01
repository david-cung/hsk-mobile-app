import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.emoji}>{passed ? '🎉' : '📚'}</Text>
      <Text style={styles.title}>{passed ? 'Great job!' : 'Keep practicing!'}</Text>
      <Text style={styles.lesson}>{params.lessonTitle}</Text>

      <Card style={styles.scoreCard}>
        <Text style={styles.score}>{params.score}%</Text>
        <Text style={styles.detail}>
          {params.correctCount} / {params.totalQuestions} correct
        </Text>
      </Card>

      <Button title="Back to Lessons" onPress={() => navigation.popToTop()} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
});
