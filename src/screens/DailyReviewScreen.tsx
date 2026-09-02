import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { reviewApi } from '../api/endpoints';
import type { ReviewCard, ReviewRating } from '../api/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { AudioPlayer } from '../components/audio/AudioPlayer';
import { useI18n } from '../i18n/I18nContext';
import { colors, spacing, typography } from '../theme';

const RATINGS: ReviewRating[] = ['AGAIN', 'HARD', 'GOOD', 'EASY'];
const RATING_LABEL_KEYS: Record<ReviewRating, 'dailyReview.rating.again' | 'dailyReview.rating.hard' | 'dailyReview.rating.good' | 'dailyReview.rating.easy'> = {
  AGAIN: 'dailyReview.rating.again',
  HARD: 'dailyReview.rating.hard',
  GOOD: 'dailyReview.rating.good',
  EASY: 'dailyReview.rating.easy',
};

function textValue(card: ReviewCard, key: string) {
  const value = card.content[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function audioSource(card: ReviewCard) {
  const hanzi = textValue(card, 'hanzi');
  return hanzi ? `tts://zh-CN/${encodeURIComponent(hanzi)}` : null;
}

function idempotencyKey(cardId: number, rating: ReviewRating) {
  return `manual:${cardId}:${rating}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
}

export function DailyReviewScreen() {
  const queryClient = useQueryClient();
  const { t, formatNumber } = useI18n();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState<Record<ReviewRating, number>>({ AGAIN: 0, HARD: 0, GOOD: 0, EASY: 0 });
  const [completed, setCompleted] = useState(false);
  const dueQuery = useQuery({ queryKey: ['review-due'], queryFn: () => reviewApi.due() });
  const items = dueQuery.data?.items ?? [];
  const card = items[index];

  const submitMutation = useMutation({
    mutationFn: (rating: ReviewRating) =>
      reviewApi.submit(card.id, {
        rating,
        idempotency_key: idempotencyKey(card.id, rating),
      }),
    onSuccess: (_result, rating) => {
      setRatings(current => ({ ...current, [rating]: current[rating] + 1 }));
      if (index + 1 >= items.length) {
        setCompleted(true);
        queryClient.invalidateQueries({ queryKey: ['review-summary'] });
        queryClient.invalidateQueries({ queryKey: ['progress-summary'] });
      } else {
        setIndex(index + 1);
        setRevealed(false);
      }
    },
  });

  const nextDueLabel = useMemo(() => {
    const next = dueQuery.data?.next_review_at;
    return next ? new Date(next).toLocaleString() : null;
  }, [dueQuery.data?.next_review_at]);

  if (dueQuery.isLoading) {
    return <View style={styles.center}><ScreenState type="loading" title={t('dailyReview.preparing')} /></View>;
  }

  if (dueQuery.isError) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('dailyReview.couldNotPrepare')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => dueQuery.refetch()}
        />
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="success"
          title={t('dailyReview.empty')}
          message={nextDueLabel ? t('dailyReview.nextReview', { date: nextDueLabel }) : t('dailyReview.emptyMessage')}
        />
      </View>
    );
  }

  if (completed) {
    const reviewed = Object.values(ratings).reduce((sum, value) => sum + value, 0);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('dailyReview.today')}</Text>
        <Card style={styles.card}>
          <Text style={styles.bigValue}>{t('dailyReview.reviewedCards', { count: formatNumber(reviewed) })}</Text>
          {RATINGS.map(rating => (
            <Text key={rating} style={styles.meta}>
              {t(RATING_LABEL_KEYS[rating])}: {formatNumber(ratings[rating])}
            </Text>
          ))}
          {nextDueLabel ? <Text style={styles.meta}>{t('dailyReview.nextReview', { date: nextDueLabel })}</Text> : null}
        </Card>
        <Button title={t('common.done')} onPress={() => dueQuery.refetch()} />
      </ScrollView>
    );
  }

  const title = card.card_type === 'GRAMMAR'
    ? textValue(card, 'pattern') ?? textValue(card, 'grammar_id') ?? t('dailyReview.grammarCard')
    : textValue(card, 'hanzi') ?? t('dailyReview.vocabularyCard');
  const pinyin = textValue(card, 'pinyin');
  const meaning = textValue(card, 'meaning');
  const example = textValue(card, 'example');
  const explanation = textValue(card, 'explanation');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('dailyReview.title')}</Text>
      <Text style={styles.subtitle}>
        {t('dailyReview.progress', { current: formatNumber(index + 1), total: formatNumber(items.length) })}
      </Text>

      <Card style={styles.card}>
        <Text style={styles.type}>{card.card_type === 'GRAMMAR' ? t('lessonType.grammar') : t('lessonType.vocabulary')}</Text>
        <Text style={card.card_type === 'GRAMMAR' ? styles.pattern : styles.hanzi}>{title}</Text>
        {pinyin ? <Text style={styles.pinyin}>{pinyin}</Text> : null}
        {card.card_type === 'VOCABULARY' ? <AudioPlayer sourceUrl={audioSource(card)} provider="tts" transcript={title} /> : null}

        {revealed ? (
          <View style={styles.answerBlock}>
            {meaning ? <Text style={styles.answer}>{meaning}</Text> : null}
            {example ? <Text style={styles.meta}>{example}</Text> : null}
            {explanation ? <Text style={styles.meta}>{explanation}</Text> : null}
          </View>
        ) : (
          <Button title={t('dailyReview.showAnswer')} onPress={() => setRevealed(true)} style={styles.showButton} />
        )}
      </Card>

      {revealed ? (
        <View style={styles.ratingGrid}>
          {RATINGS.map(rating => {
            const preview = card.rating_previews.find(item => item.rating === rating);
            return (
              <Button
                key={rating}
                title={`${t(RATING_LABEL_KEYS[rating])}\n${preview?.interval_label ?? '-'}`}
                variant={rating === 'AGAIN' ? 'ghost' : rating === 'EASY' ? 'secondary' : 'primary'}
                onPress={() => submitMutation.mutate(rating)}
                disabled={submitMutation.isPending}
                loading={submitMutation.isPending}
                style={styles.ratingButton}
              />
            );
          })}
        </View>
      ) : null}

      {submitMutation.isError ? (
        <ScreenState
          type="error"
          title={t('dailyReview.couldNotSubmit')}
          message={submitMutation.error instanceof Error ? submitMutation.error.message : t('common.connectionRetry')}
          compact
          style={styles.error}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  subtitle: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackLg },
  card: { marginBottom: spacing.stackMd },
  type: { ...typography.labelSm, color: colors.primary, marginBottom: spacing.stackSm },
  hanzi: { fontSize: 48, color: colors.onSurface, marginBottom: spacing.stackSm },
  pattern: { ...typography.headlineLgMobile, color: colors.onSurface, marginBottom: spacing.stackSm },
  pinyin: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackSm },
  answerBlock: { marginTop: spacing.stackMd, borderTopWidth: 1, borderTopColor: colors.surfaceContainer, paddingTop: spacing.stackMd },
  answer: { ...typography.headlineMd, color: colors.onSurface },
  meta: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  bigValue: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  showButton: { alignSelf: 'flex-start', marginTop: spacing.stackMd },
  ratingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackSm },
  ratingButton: { width: '48%', minHeight: 64 },
  error: { marginTop: spacing.stackMd },
});
