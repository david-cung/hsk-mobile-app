import { RouteProp, useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { grammarApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { localizeText } from '../i18n/content';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'GrammarDetail'>;

export function GrammarDetailScreen() {
  const { params } = useRoute<Route>();
  const queryClient = useQueryClient();
  const { language, t } = useI18n();
  const query = useQuery({
    queryKey: ['grammar', params.grammarId],
    queryFn: () => grammarApi.detail(params.grammarId),
  });
  const complete = useMutation({
    mutationFn: () => grammarApi.complete(params.grammarId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['grammar', params.grammarId],
      }),
  });

  useEffect(() => {
    if (query.data) {
      grammarApi.viewed(params.grammarId).catch(() => undefined);
    }
  }, [params.grammarId, query.data]);

  if (query.isLoading) {
    return <ScreenState type="loading" title={t('grammarDetail.loading')} />;
  }
  if (query.isError || !query.data) {
    return (
      <ScreenState
        type="error"
        title={t('grammarDetail.couldNotLoad')}
        message={t('common.connectionRetry')}
        actionLabel={t('common.tryAgain')}
        onAction={() => query.refetch()}
      />
    );
  }

  const item = query.data;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.hero}>
        <Text style={styles.level}>HSK {item.hsk_level}</Text>
        <Text style={styles.title}>
          {localizeText(item.title_translations, language, item.title)}
        </Text>
        {item.pattern ? <Text style={styles.pattern}>{item.pattern}</Text> : null}
        <Text style={styles.explanation}>
          {localizeText(item.explanation_translations, language, '')}
        </Text>
      </Card>
      <Button
        title={t('grammarDetail.markComplete')}
        loading={complete.isPending}
        disabled={item.learning_status === 'completed'}
        onPress={() => complete.mutate()}
      />
      <Text style={styles.section}>{t('lessonDetail.examples')}</Text>
      {item.examples.length ? (
        item.examples.map(example => (
          <Card key={example.id} style={styles.example}>
            <Text style={styles.chinese}>{example.chinese}</Text>
            {example.pinyin ? (
              <Text style={styles.pinyin}>{example.pinyin}</Text>
            ) : null}
            <Text style={styles.translation}>
              {localizeText(example.translations, language, '')}
            </Text>
          </Card>
        ))
      ) : (
        <ScreenState type="empty" title={t('grammarDetail.noExamples')} compact />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 60 },
  hero: { marginBottom: spacing.stackMd },
  level: { ...typography.labelSm, color: colors.primary },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginTop: spacing.stackSm,
  },
  pattern: {
    ...typography.headlineMd,
    color: colors.tertiary,
    marginTop: spacing.stackMd,
  },
  explanation: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginTop: spacing.stackMd,
  },
  section: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: spacing.stackLg,
    marginBottom: spacing.stackMd,
  },
  example: { marginBottom: spacing.stackSm },
  chinese: { ...typography.bodyZh, color: colors.onSurface },
  pinyin: { ...typography.bodyMd, color: colors.primary, marginTop: spacing.stackSm },
  translation: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
  },
});
