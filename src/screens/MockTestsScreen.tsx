import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { examApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MockTestsScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
  const { t, formatNumber } = useI18n();
  const { data: exams, isLoading, isError, refetch } = useQuery({
    queryKey: ['exams'],
    queryFn: () => examApi.list(),
  });
  const { data: history } = useQuery({
    queryKey: ['exam-history'],
    queryFn: () => examApi.history(5),
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>{t('mockTests.intro', { level: profile?.target_hsk_level ?? 1 })}</Text>

      {isLoading ? (
        <ScreenState type="loading" title={t('mockTests.loading')} />
      ) : isError ? (
        <ScreenState
          type="error"
          title={t('mockTests.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => refetch()}
        />
      ) : !exams?.length ? (
        <ScreenState type="empty" title={t('mockTests.empty')} message={t('mockTests.emptyMessage')} />
      ) : (
        exams.map(exam => (
          <Pressable
            key={exam.id}
            accessibilityRole="button"
            accessibilityLabel={`${exam.title}, HSK ${exam.hsk_level}`}
            onPress={() => navigation.navigate('MockExamDetail', { examId: exam.id, title: exam.title, titleTranslations: exam.title_translations })}
          >
            <Card style={styles.testCard}>
              <Text style={styles.testTitle}>{exam.title}</Text>
              <View style={styles.meta}>
                <Text style={styles.metaText}>HSK {exam.hsk_level}</Text>
                <Text style={styles.metaText}>{formatNumber(exam.duration_minutes)} {t('common.minutesShort')}</Text>
                <Text style={styles.metaText}>{formatNumber(exam.question_count)} {t('common.questions')}</Text>
              </View>
              <Text style={styles.sections}>{exam.sections.map(section => section.title).join(' · ')}</Text>
              {exam.best_percentage != null ? (
                <Text style={styles.start}>{t('mockTests.bestScore', { score: formatNumber(Math.round(exam.best_percentage)) })}</Text>
              ) : (
                <Text style={styles.start}>{t('mockTests.tapStart')}</Text>
              )}
            </Card>
          </Pressable>
        ))
      )}

      {history?.length ? (
        <>
          <Text style={styles.historyTitle}>{t('mockTests.history')}</Text>
          {history.map(item => (
            <Pressable
              key={item.attempt_id}
              accessibilityRole="button"
              onPress={() => navigation.navigate('MockExamResult', { attemptId: item.attempt_id })}
            >
              <Card style={styles.historyCard}>
                <Text style={styles.metaText}>{item.title}</Text>
                <Text style={styles.start}>{item.percentage == null ? item.status : `${formatNumber(Math.round(item.percentage))}%`}</Text>
              </Card>
            </Pressable>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 80 },
  intro: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackLg },
  testCard: { marginBottom: spacing.stackMd },
  testTitle: { ...typography.headlineMd, color: colors.onSurface },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackMd, marginTop: spacing.stackSm },
  metaText: { ...typography.labelMd, color: colors.onSurfaceVariant },
  sections: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  start: { ...typography.labelMd, color: colors.primary, marginTop: spacing.stackMd },
  historyTitle: { ...typography.headlineMd, color: colors.onSurface, marginVertical: spacing.stackMd },
  historyCard: { marginBottom: spacing.stackSm },
});
