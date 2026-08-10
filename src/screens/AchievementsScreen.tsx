import { useQuery } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

import { learningApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { colors, spacing, typography } from '../theme';
import type { TranslationKey } from '../i18n/translations';

const ICON_MAP: Record<string, IoniconName> = {
  school: 'school',
  flame: 'flame',
  bookmark: 'bookmark',
  trophy: 'trophy',
};

export function AchievementsScreen() {
  const { t, formatDate } = useI18n();
  const { data: achievements, isLoading, isError, refetch } = useQuery({
    queryKey: ['achievements'],
    queryFn: learningApi.achievements,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title={t('achievements.loading')} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('achievements.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => {
            refetch();
          }}
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={achievements}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={
        <ScreenState
          type="empty"
          title={t('achievements.empty')}
          message={t('achievements.emptyMessage')}
        />
      }
      renderItem={({ item }) => (
        (() => {
          const titleKey = `achievements.${item.code}.title` as TranslationKey;
          const descriptionKey = `achievements.${item.code}.description` as TranslationKey;
          const title = t(titleKey, undefined, item.title);
          const description = t(descriptionKey, undefined, item.description ?? '');
          return (
        <Card
          style={[styles.card, !item.earned && styles.locked]}
          accessibilityRole="summary"
          accessibilityLabel={`${title}, ${item.earned ? t('common.earnedState') : t('common.locked')}`}
        >
          <View style={styles.row}>
            <View style={[styles.iconWrap, item.earned && styles.iconEarned]}>
              <Ionicons
                name={ICON_MAP[item.icon ?? ''] ?? 'ribbon'}
                size={28}
                color={item.earned ? colors.secondary : colors.onSurfaceVariant}
              />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
              {item.earned && item.earned_at && (
                <Text style={styles.earned}>{t('common.earned')} {formatDate(item.earned_at)}</Text>
              )}
            </View>
          </View>
        </Card>
          );
        })()
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
