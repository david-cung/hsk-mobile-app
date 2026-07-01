import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ActivityIndicator,
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
import { colors, radius, spacing, typography } from '../theme';

export function SavedWordsScreen() {
  const queryClient = useQueryClient();
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaning, setMeaning] = useState('');

  const { data: words, isLoading } = useQuery({
    queryKey: ['savedWords'],
    queryFn: learningApi.savedWords,
  });

  const addMutation = useMutation({
    mutationFn: () => learningApi.addSavedWord({ hanzi, pinyin, meaning }),
    onSuccess: () => {
      setHanzi('');
      setPinyin('');
      setMeaning('');
      queryClient.invalidateQueries({ queryKey: ['savedWords'] });
    },
    onError: (e) => Alert.alert('Error', e instanceof Error ? e.message : 'Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => learningApi.deleteSavedWord(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedWords'] }),
  });

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="汉字 (Hanzi)"
          placeholderTextColor={colors.onSurfaceVariant}
          value={hanzi}
          onChangeText={setHanzi}
        />
        <TextInput
          style={styles.input}
          placeholder="Pinyin"
          placeholderTextColor={colors.onSurfaceVariant}
          value={pinyin}
          onChangeText={setPinyin}
        />
        <TextInput
          style={styles.input}
          placeholder="Meaning"
          placeholderTextColor={colors.onSurfaceVariant}
          value={meaning}
          onChangeText={setMeaning}
        />
        <Button
          title="Save Word"
          onPress={() => {
            if (!hanzi.trim()) {
              Alert.alert('Error', 'Hanzi is required');
              return;
            }
            addMutation.mutate();
          }}
          loading={addMutation.isPending}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={words}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No saved words yet</Text>}
          renderItem={({ item }) => (
            <Card style={styles.wordCard}>
              <View style={styles.wordRow}>
                <View>
                  <Text style={styles.hanzi}>{item.hanzi}</Text>
                  {item.pinyin && <Text style={styles.pinyin}>{item.pinyin}</Text>}
                  {item.meaning && <Text style={styles.meaning}>{item.meaning}</Text>}
                </View>
                <Button
                  title="Remove"
                  variant="ghost"
                  onPress={() => deleteMutation.mutate(item.id)}
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
    borderRadius: radius.lg,
    padding: spacing.stackMd,
    marginBottom: spacing.stackSm,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  loader: { marginTop: spacing.stackLg },
  list: { padding: spacing.marginMobile, paddingBottom: 40 },
  empty: { ...typography.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 40 },
  wordCard: { marginBottom: spacing.stackSm },
  wordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hanzi: { fontSize: 32, color: colors.onSurface },
  pinyin: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  meaning: { ...typography.bodyMd, color: colors.onSurface, marginTop: 4 },
});
