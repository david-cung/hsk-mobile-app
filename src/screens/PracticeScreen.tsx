import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { contentApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { getLevelDescription, getLevelTitle } from '../i18n/content';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { colors, spacing, typography } from '../theme';

export function PracticeScreen() {
  const navigation = useRootNavigation();
  const { language, t, formatNumber } = useI18n();
  const { data: levels, isLoading, isError, refetch } = useQuery({
    queryKey: ['levels'],
    queryFn: contentApi.levels,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('practice.title')}</Text>
      <Text style={styles.subtitle}>{t('practice.subtitle')}</Text>

      {isLoading ? (
        <ScreenState type="loading" title={t('practice.loadingLevels')} />
      ) : isError ? (
        <ScreenState
          type="error"
          title={t('practice.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => {
            refetch();
          }}
        />
      ) : !levels?.length ? (
        <ScreenState
          type="empty"
          title={t('practice.noLevels')}
          message={t('practice.noLevelsMessage')}
        />
      ) : (
        levels?.map((level) => {
          const title = getLevelTitle(level, language);
          const description = getLevelDescription(level, language);
          return (
          <Pressable
            key={level.id}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${formatNumber(level.total_characters)} ${t('common.characters')}`}
            onPress={() =>
              navigation.navigate('CourseList', {
                levelId: level.id,
                levelTitle: title,
                levelTitleTranslations: level.title_translations,
              })
            }
          >
            <Card style={styles.levelCard}>
              <View style={styles.row}>
                <Text style={styles.levelTitle}>{title}</Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>HSK {level.level_number}</Text>
                </View>
              </View>
              {description ? (
                <Text style={styles.description}>{description}</Text>
              ) : null}
              <Text style={styles.meta}>
                {formatNumber(level.total_characters)} {t('common.characters')}
              </Text>
            </Card>
          </Pressable>
          );
        })
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
