import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { learningApi, reviewApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { colors, radius, spacing, typography } from '../theme';

export function SavedWordsScreen() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaning, setMeaning] = useState('');
  const [hanziError, setHanziError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const { data: words, isLoading, isError, refetch } = useQuery({
    queryKey: ['savedWords'],
    queryFn: learningApi.savedWords,
  });
  const { data: reviewCards } = useQuery({
    queryKey: ['review-cards', 'VOCABULARY'],
    queryFn: () => reviewApi.cards('VOCABULARY'),
  });
  const reviewedWordIds = useMemo(
    () => new Set((reviewCards ?? []).map(card => card.vocabulary_id).filter((id): id is number => typeof id === 'number')),
    [reviewCards],
  );

  const addMutation = useMutation({
    mutationFn: () =>
      learningApi.addSavedWord({
        hanzi: hanzi.trim(),
        pinyin: pinyin.trim() || undefined,
        meaning: meaning.trim() || undefined,
      }),
    onSuccess: () => {
      setHanzi('');
      setPinyin('');
      setMeaning('');
      setNotice(t('savedWords.wordSaved'));
      queryClient.invalidateQueries({ queryKey: ['savedWords'] });
      queryClient.invalidateQueries({ queryKey: ['review-cards', 'VOCABULARY'] });
      queryClient.invalidateQueries({ queryKey: ['progress-summary'] });
    },
    onError: (e) => {
      setNotice(null);
      setFormError(e instanceof Error ? e.message : t('savedWords.failedSave'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => learningApi.deleteSavedWord(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedWords'] }),
    onError: (e) => Alert.alert(t('common.error'), e instanceof Error ? e.message : t('savedWords.failedRemove')),
  });
  const enrollMutation = useMutation({
    mutationFn: (word: NonNullable<typeof words>[number]) =>
      reviewApi.enroll({
        card_type: 'VOCABULARY',
        vocabulary_id: word.id,
        content_key: `saved-word:${word.id}`,
        content: {
          hanzi: word.hanzi,
          pinyin: word.pinyin,
          meaning: word.meaning,
          hsk_level: word.hsk_level,
        },
      }),
    onSuccess: () => {
      setNotice(t('savedWords.reviewAdded'));
      queryClient.invalidateQueries({ queryKey: ['review-cards', 'VOCABULARY'] });
      queryClient.invalidateQueries({ queryKey: ['review-due'] });
      queryClient.invalidateQueries({ queryKey: ['progress-summary'] });
    },
    onError: (e) => Alert.alert(t('common.error'), e instanceof Error ? e.message : t('savedWords.failedSave')),
  });

  const saveWord = () => {
    setNotice(null);
    setFormError(null);
    if (!hanzi.trim()) {
      setHanziError(t('savedWords.hanziRequired'));
      return;
    }
    setHanziError(null);
    addMutation.mutate();
  };

  const confirmDelete = (id: number) => {
    Alert.alert(t('savedWords.removeQuestion'), t('savedWords.removeMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.remove'), style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={[styles.input, hanziError && styles.inputError]}
          placeholder="汉字"
          placeholderTextColor={colors.onSurfaceVariant}
          value={hanzi}
          onChangeText={(value) => {
            setHanzi(value);
            setHanziError(null);
            setFormError(null);
            setNotice(null);
          }}
          accessibilityLabel={t('savedWords.hanzi')}
        />
        {hanziError ? <Text style={styles.errorText}>{hanziError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder={t('savedWords.pinyin')}
          placeholderTextColor={colors.onSurfaceVariant}
          value={pinyin}
          onChangeText={(value) => {
            setPinyin(value);
            setFormError(null);
            setNotice(null);
          }}
          accessibilityLabel={t('savedWords.pinyin')}
        />
        <TextInput
          style={styles.input}
          placeholder={t('savedWords.meaning')}
          placeholderTextColor={colors.onSurfaceVariant}
          value={meaning}
          onChangeText={(value) => {
            setMeaning(value);
            setFormError(null);
            setNotice(null);
          }}
          accessibilityLabel={t('savedWords.meaning')}
        />
        {notice ? (
          <ScreenState type="success" title={notice} compact style={styles.notice} />
        ) : null}
        {formError ? (
          <ScreenState
            type="error"
            title={t('savedWords.couldNotSave')}
            message={formError}
            compact
            style={styles.notice}
          />
        ) : null}
        <Button
          title={t('savedWords.saveWord')}
          leftIcon="bookmark-outline"
          onPress={saveWord}
          loading={addMutation.isPending}
          disabled={addMutation.isPending}
        />
      </View>

      {isLoading ? (
        <View style={styles.stateWrap}>
          <ScreenState type="loading" title={t('savedWords.loading')} />
        </View>
      ) : isError ? (
        <View style={styles.stateWrap}>
          <ScreenState
            type="error"
            title={t('savedWords.couldNotLoad')}
            message={t('common.connectionRetry')}
            actionLabel={t('common.tryAgain')}
            onAction={() => {
              refetch();
            }}
          />
        </View>
      ) : (
        <FlatList
          data={words}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <ScreenState
              type="empty"
              title={t('savedWords.empty')}
              message={t('savedWords.emptyMessage')}
            />
          }
          renderItem={({ item }) => (
            <Card style={styles.wordCard}>
              <View style={styles.wordRow}>
                <View style={styles.wordText}>
                  <Text style={styles.hanzi}>{item.hanzi}</Text>
                  {item.pinyin && <Text style={styles.pinyin}>{item.pinyin}</Text>}
                  {item.meaning && <Text style={styles.meaning}>{item.meaning}</Text>}
                </View>
                <Button
                  title={t('common.remove')}
                  leftIcon="trash-outline"
                  variant="ghost"
                  disabled={deleteMutation.isPending}
                  onPress={() => confirmDelete(item.id)}
                  style={styles.removeButton}
                />
              </View>
              {reviewedWordIds.has(item.id) ? (
                <Text style={styles.reviewStatus}>{t('savedWords.inReview')}</Text>
              ) : (
                <Button
                  title={t('savedWords.addToReview')}
                  leftIcon="refresh-outline"
                  variant="secondary"
                  disabled={enrollMutation.isPending}
                  onPress={() => enrollMutation.mutate(item)}
                  style={styles.addReviewButton}
                />
              )}
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  form: { padding: spacing.marginMobile, borderBottomWidth: 1, borderBottomColor: colors.surfaceContainer },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    marginBottom: spacing.stackSm,
    ...typography.bodyMd,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.surfaceContainer,
  },
  inputError: { borderColor: colors.error, backgroundColor: colors.errorContainer },
  errorText: { ...typography.labelSm, color: colors.error, marginTop: -spacing.stackSm, marginBottom: spacing.stackSm },
  notice: { marginBottom: spacing.stackSm },
  stateWrap: { padding: spacing.marginMobile },
  list: { padding: spacing.marginMobile, paddingBottom: 40, flexGrow: 1 },
  wordCard: { marginBottom: spacing.stackSm },
  wordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordText: { flex: 1, paddingRight: spacing.stackMd },
  hanzi: { fontSize: 32, color: colors.onSurface },
  pinyin: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  meaning: { ...typography.bodyMd, color: colors.onSurface, marginTop: 4 },
  removeButton: { minWidth: 112 },
  reviewStatus: { ...typography.labelSm, color: colors.primary, marginTop: spacing.stackSm },
  addReviewButton: { alignSelf: 'flex-start', marginTop: spacing.stackSm },
});
