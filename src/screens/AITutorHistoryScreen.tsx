import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { tutorApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { colors, spacing, typography } from '../theme';

const PAGE_SIZE = 20;

export function AITutorHistoryScreen() {
  const navigation = useRootNavigation();
  const { t, formatNumber } = useI18n();
  const [offset, setOffset] = useState(0);
  const historyQuery = useQuery({
    queryKey: ['ai-conversations', offset],
    queryFn: () => tutorApi.list(PAGE_SIZE, offset),
  });

  if (historyQuery.isLoading) {
    return <ScreenState type="loading" title={t('aiTutor.historyLoading')} />;
  }
  if (historyQuery.isError) {
    return (
      <ScreenState
        type="error"
        title={t('aiTutor.couldNotLoadHistory')}
        message={t('common.connectionRetry')}
        actionLabel={t('common.tryAgain')}
        onAction={() => historyQuery.refetch()}
      />
    );
  }

  const items = historyQuery.data?.items ?? [];
  const total = historyQuery.data?.total ?? 0;
  if (!items.length) {
    return <ScreenState type="empty" title={t('aiTutor.historyEmpty')} message={t('aiTutor.historyEmptyMessage')} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {items.map(item => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          onPress={() => navigation.navigate('AiTutor', { conversationId: item.id })}
        >
          <Card style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>{t(modeLabelKey(item.mode))}</Text>
          </Card>
        </Pressable>
      ))}
      {offset + PAGE_SIZE < total ? (
        <Button
          title={t('aiTutor.loadMore')}
          variant="secondary"
          onPress={() => setOffset(current => current + PAGE_SIZE)}
          accessibilityLabel={t('aiTutor.loadMore')}
        />
      ) : (
        <Text style={styles.meta}>{t('aiTutor.showingCount', { count: formatNumber(items.length) })}</Text>
      )}
    </ScrollView>
  );
}

function modeLabelKey(
  mode: string,
): 'aiTutor.mode.freeChat' | 'aiTutor.mode.lesson' | 'aiTutor.mode.rolePlay' | 'aiTutor.mode.grammar' | 'aiTutor.mode.vocabulary' {
  if (mode === 'LESSON_PRACTICE') return 'aiTutor.mode.lesson';
  if (mode === 'ROLE_PLAY') return 'aiTutor.mode.rolePlay';
  if (mode === 'GRAMMAR_PRACTICE') return 'aiTutor.mode.grammar';
  if (mode === 'VOCABULARY_PRACTICE') return 'aiTutor.mode.vocabulary';
  return 'aiTutor.mode.freeChat';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 40 },
  card: { marginBottom: spacing.stackMd },
  title: { ...typography.bodyMd, color: colors.onSurface },
  meta: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 4 },
});
