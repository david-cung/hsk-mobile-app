import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { examApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'MockExamDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MockExamDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { t, formatNumber } = useI18n();
  const detailQuery = useQuery({ queryKey: ['exam-detail', params.examId], queryFn: () => examApi.detail(params.examId) });
  const startMutation = useMutation({
    mutationFn: () => examApi.start(params.examId),
    onSuccess: attempt => {
      queryClient.invalidateQueries({ queryKey: ['exam-history'] });
      navigation.replace('MockTestSession', { attemptId: attempt.attempt_id });
    },
  });

  if (detailQuery.isLoading) {
    return <View style={styles.center}><ScreenState type="loading" title={t('mockTests.loading')} /></View>;
  }
  if (detailQuery.isError || !detailQuery.data) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('mockTests.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => detailQuery.refetch()}
        />
      </View>
    );
  }

  const exam = detailQuery.data;
  const latestAttempt = exam.latest_attempt_id;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{exam.title}</Text>
      <Text style={styles.meta}>HSK {exam.hsk_level} · {formatNumber(exam.duration_minutes)} {t('common.minutesShort')} · {formatNumber(exam.question_count)} {t('common.questions')}</Text>
      {exam.description ? <Text style={styles.description}>{exam.description}</Text> : null}

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t('mockTests.sections')}</Text>
        {exam.sections.map(section => (
          <Text key={section.type} style={styles.row}>
            {section.title}: {formatNumber(section.question_count)} {t('common.questions')} · {formatNumber(section.duration_minutes)} {t('common.minutesShort')}
          </Text>
        ))}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t('mockTests.instructions')}</Text>
        <Text style={styles.description}>{exam.instructions ?? t('mockTests.timerWarning')}</Text>
        <Text style={styles.warning}>{t('mockTests.timerWarning')}</Text>
      </Card>

      {startMutation.isError ? (
        <ScreenState
          type="error"
          title={t('mockSession.couldNotLoad')}
          message={startMutation.error instanceof Error ? startMutation.error.message : t('common.connectionRetry')}
          compact
          style={styles.card}
        />
      ) : null}

      <Button
        title={t('mockTests.startExam')}
        rightIcon="play"
        loading={startMutation.isPending}
        disabled={startMutation.isPending}
        onPress={() => startMutation.mutate()}
      />
      {latestAttempt ? (
        <Button
          title={t('mockTests.resumeLatest')}
          variant="secondary"
          rightIcon="arrow-forward"
          onPress={() => navigation.navigate('MockTestSession', { attemptId: latestAttempt })}
          style={styles.resumeButton}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 80 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  meta: { ...typography.labelMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  description: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  card: { marginVertical: spacing.stackMd },
  cardTitle: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  row: { ...typography.bodyMd, color: colors.onSurface, marginTop: spacing.stackSm },
  warning: { ...typography.labelMd, color: colors.error, marginTop: spacing.stackMd },
  resumeButton: { marginTop: spacing.stackSm },
});
