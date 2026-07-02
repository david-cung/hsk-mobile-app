import { useQuery } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

import { learningApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { colors, spacing, typography } from '../theme';

const ICON_MAP: Record<string, IoniconName> = {
  school: 'school',
  flame: 'flame',
  bookmark: 'bookmark',
  trophy: 'trophy',
};

export function AchievementsScreen() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: learningApi.achievements,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={achievements}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Card style={[styles.card, !item.earned && styles.locked]}>
          <View style={styles.row}>
            <View style={[styles.iconWrap, item.earned && styles.iconEarned]}>
              <Ionicons
                name={ICON_MAP[item.icon ?? ''] ?? 'ribbon'}
                size={28}
                color={item.earned ? colors.secondary : colors.onSurfaceVariant}
              />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              {item.earned && item.earned_at && (
                <Text style={styles.earned}>Earned {new Date(item.earned_at).toLocaleDateString()}</Text>
              )}
            </View>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.marginMobile },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { marginBottom: spacing.stackMd },
  locked: { opacity: 0.6 },
  row: { flexDirection: 'row', gap: spacing.stackMd },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEarned: { backgroundColor: colors.secondaryContainer },
  textWrap: { flex: 1 },
  title: { ...typography.headlineMd, color: colors.onSurface },
  description: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 },
  earned: { ...typography.labelSm, color: colors.tertiary, marginTop: spacing.stackSm },
});
