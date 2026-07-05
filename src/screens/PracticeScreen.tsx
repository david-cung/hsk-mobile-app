import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { contentApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { colors, spacing, typography } from '../theme';

export function PracticeScreen() {
  const navigation = useRootNavigation();
  const { data: levels, isLoading, isError, refetch } = useQuery({
    queryKey: ['levels'],
    queryFn: contentApi.levels,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Practice Hub</Text>
      <Text style={styles.subtitle}>Choose an HSK level to start practicing</Text>

      {isLoading ? (
        <ScreenState type="loading" title="Loading levels" />
      ) : isError ? (
        <ScreenState
          type="error"
          title="Could not load levels"
          message="Please check your connection and try again."
          actionLabel="Try Again"
          onAction={() => {
            refetch();
          }}
        />
      ) : !levels?.length ? (
        <ScreenState
          type="empty"
          title="No HSK levels yet"
          message="Start the backend seed data, then return to practice."
        />
      ) : (
        levels?.map((level) => (
          <Pressable
            key={level.id}
            accessibilityRole="button"
            accessibilityLabel={`${level.title}, ${level.total_characters} characters`}
            onPress={() =>
              navigation.navigate('LessonList', { levelId: level.id, levelTitle: level.title })
            }
          >
            <Card style={styles.levelCard}>
              <View style={styles.row}>
                <Text style={styles.levelTitle}>{level.title}</Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>HSK {level.level_number}</Text>
                </View>
              </View>
              {level.description && (
                <Text style={styles.description}>{level.description}</Text>
              )}
              <Text style={styles.meta}>{level.total_characters} characters</Text>
            </Card>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 100 },
  title: { ...typography.headlineLgMobile, color: colors.onSurface, marginBottom: spacing.stackSm },
  subtitle: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackLg },
  levelCard: { marginBottom: spacing.stackMd },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelTitle: { ...typography.headlineMd, color: colors.onSurface },
  chip: {
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { ...typography.labelSm, color: colors.onTertiaryContainer },
  description: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  meta: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
});
