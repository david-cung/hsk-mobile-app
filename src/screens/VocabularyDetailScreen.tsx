import { RouteProp, useRoute } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { vocabularyApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { SpeakButton } from '../components/SpeakButton';
import { useI18n } from '../i18n/I18nContext';
import { localizeText } from '../i18n/content';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'VocabularyDetail'>;

export function VocabularyDetailScreen() {
  const { params } = useRoute<Route>();
  const queryClient = useQueryClient();
  const { language, t } = useI18n();
  const query = useQuery({
    queryKey: ['vocabulary', params.vocabularyId],
    queryFn: () => vocabularyApi.detail(params.vocabularyId),
  });
  const favorite = useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) {
        await vocabularyApi.unfavorite(params.vocabularyId);
      } else {
        await vocabularyApi.favorite(params.vocabularyId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vocabulary', params.vocabularyId],
      });
      queryClient.invalidateQueries({ queryKey: ['savedWords'] });
    },
  });
  const learned = useMutation({
    mutationFn: () =>
      vocabularyApi.updateStatus(params.vocabularyId, 'learned'),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['vocabulary', params.vocabularyId],
      }),
  });

  useEffect(() => {
    if (query.data) {
      vocabularyApi.viewed(params.vocabularyId).catch(() => undefined);
    }
  }, [params.vocabularyId, query.data]);

  if (query.isLoading) {
    return <ScreenState type="loading" title={t('vocabularyDetail.loading')} />;
  }
  if (query.isError || !query.data) {
    return (
      <ScreenState
        type="error"
        title={t('vocabularyDetail.couldNotLoad')}
        message={t('common.connectionRetry')}
        actionLabel={t('common.tryAgain')}
        onAction={() => query.refetch()}
      />
    );
  }

  const item = query.data;
  const meaning = localizeText(item.meaning_translations, language, '');
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.hero}>
        <View style={styles.wordRow}>
          <Text style={styles.word}>{item.simplified}</Text>
          <SpeakButton text={item.simplified} />
        </View>
        {item.traditional && item.traditional !== item.simplified ? (
          <Text style={styles.traditional}>{item.traditional}</Text>
        ) : null}
        <Text style={styles.pinyin}>{item.pinyin || t('vocabularyDetail.noPinyin')}</Text>
        <Text style={styles.meaning}>{meaning}</Text>
        <Text style={styles.meta}>
          HSK {item.hsk_level} · {item.part_of_speech} · {item.learning_status}
        </Text>
      </Card>

      <Button
        title={
          item.is_favorite
            ? t('vocabularyDetail.unfavorite')
            : t('vocabularyDetail.favorite')
        }
        variant="secondary"
        leftIcon={item.is_favorite ? 'bookmark' : 'bookmark-outline'}
        loading={favorite.isPending}
        onPress={() => favorite.mutate(item.is_favorite)}
        style={styles.action}
      />
      <Button
        title={t('vocabularyDetail.markLearned')}
        disabled={item.learning_status === 'learned' || item.learning_status === 'mastered'}
        loading={learned.isPending}
        onPress={() => learned.mutate()}
        style={styles.action}
      />

      <Text style={styles.section}>{t('lessonDetail.examples')}</Text>
      {item.examples.length ? (
        item.examples.map(example => (
          <Card key={example.id} style={styles.example}>
            <Text style={styles.exampleChinese}>{example.chinese}</Text>
            {example.pinyin ? (
              <Text style={styles.examplePinyin}>{example.pinyin}</Text>
            ) : null}
            <Text style={styles.exampleMeaning}>
              {localizeText(example.translations, language, '')}
            </Text>
          </Card>
        ))
      ) : (
        <ScreenState
          type="empty"
          title={t('vocabularyDetail.noExamples')}
          compact
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 60 },
  hero: { marginBottom: spacing.stackMd },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.stackSm },
  word: { ...typography.displayZh, color: colors.onSurface },
  traditional: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  pinyin: { ...typography.headlineMd, color: colors.primary, marginTop: spacing.stackSm },
  meaning: { ...typography.bodyLg, color: colors.onSurface, marginTop: spacing.stackSm },
  meta: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: spacing.stackMd },
  action: { marginBottom: spacing.stackSm },
  section: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: spacing.stackLg,
    marginBottom: spacing.stackMd,
  },
  example: { marginBottom: spacing.stackSm },
  exampleChinese: { ...typography.headlineMd, color: colors.onSurface },
  examplePinyin: { ...typography.bodyMd, color: colors.primary, marginTop: spacing.stackSm },
  exampleMeaning: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
  },
});
