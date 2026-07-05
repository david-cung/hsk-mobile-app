import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { learningApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { colors, radius, spacing, typography } from '../theme';

export function SavedWordsScreen() {
  const queryClient = useQueryClient();
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
      setNotice('Word saved.');
      queryClient.invalidateQueries({ queryKey: ['savedWords'] });
    },
    onError: (e) => {
      setNotice(null);
      setFormError(e instanceof Error ? e.message : 'Failed to save');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => learningApi.deleteSavedWord(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedWords'] }),
    onError: (e) => Alert.alert('Error', e instanceof Error ? e.message : 'Failed to remove word'),
  });

  const saveWord = () => {
    setNotice(null);
    setFormError(null);
    if (!hanzi.trim()) {
      setHanziError('Hanzi is required.');
      return;
    }
    setHanziError(null);
    addMutation.mutate();
  };

  const confirmDelete = (id: number) => {
    Alert.alert('Remove saved word?', 'This word will be removed from your review list.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={[styles.input, hanziError && styles.inputError]}
          placeholder="汉字 (Hanzi)"
          placeholderTextColor={colors.onSurfaceVariant}
          value={hanzi}
          onChangeText={(value) => {
            setHanzi(value);
            setHanziError(null);
            setFormError(null);
            setNotice(null);
          }}
          accessibilityLabel="Hanzi"
        />
        {hanziError ? <Text style={styles.errorText}>{hanziError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Pinyin"
          placeholderTextColor={colors.onSurfaceVariant}
          value={pinyin}
          onChangeText={(value) => {
            setPinyin(value);
            setFormError(null);
            setNotice(null);
          }}
          accessibilityLabel="Pinyin"
        />
        <TextInput
          style={styles.input}
          placeholder="Meaning"
          placeholderTextColor={colors.onSurfaceVariant}
          value={meaning}
          onChangeText={(value) => {
            setMeaning(value);
            setFormError(null);
            setNotice(null);
          }}
          accessibilityLabel="Meaning"
        />
        {notice ? (
          <ScreenState type="success" title={notice} compact style={styles.notice} />
        ) : null}
        {formError ? (
          <ScreenState
            type="error"
            title="Could not save word"
            message={formError}
            compact
            style={styles.notice}
          />
        ) : null}
        <Button
          title="Save Word"
          leftIcon="bookmark-outline"
          onPress={saveWord}
          loading={addMutation.isPending}
          disabled={addMutation.isPending}
        />
      </View>

      {isLoading ? (
        <View style={styles.stateWrap}>
          <ScreenState type="loading" title="Loading saved words" />
        </View>
      ) : isError ? (
        <View style={styles.stateWrap}>
          <ScreenState
            type="error"
            title="Could not load saved words"
            message="Please check your connection and try again."
            actionLabel="Try Again"
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
              title="No saved words yet"
              message="Save words from lessons or add your own above."
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
                  title="Remove"
                  leftIcon="trash-outline"
                  variant="ghost"
                  disabled={deleteMutation.isPending}
                  onPress={() => confirmDelete(item.id)}
                  style={styles.removeButton}
                />
              </View>
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
});
