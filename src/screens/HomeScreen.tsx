import { useRootNavigation } from '../navigation/useRootNavigation';
import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { contentApi, progressApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenState } from '../components/ScreenState';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { getLevelTitle } from '../i18n/content';
import { colors, spacing, typography } from '../theme';

const FOCUS_AREAS = [
  { labelKey: 'lessonType.mixed' as const, icon: 'layers' as const, type: 'mixed' },
  { labelKey: 'lessonType.vocabulary' as const, icon: 'language' as const, type: 'vocabulary' },
  { labelKey: 'lessonType.grammar' as const, icon: 'document-text' as const, type: 'grammar' },
  { labelKey: 'lessonType.listening' as const, icon: 'headset' as const, type: 'listening' },
  { labelKey: 'lessonType.reading' as const, icon: 'book' as const, type: 'reading' },
  { labelKey: 'lessonType.patterns' as const, icon: 'text' as const, type: 'sentence_pattern' },
  { labelKey: 'lessonType.conversation' as const, icon: 'chatbubbles' as const, type: 'conversation' },
  { labelKey: 'lessonType.practice' as const, icon: 'fitness' as const, type: 'practice' },
  {
    labelKey: 'nav.mockTest' as const,
    icon: 'help-circle' as const,
    route: 'MockTests' as const,
  },
];

export function HomeScreen() {
  const navigation = useRootNavigation();
  const { user, profile } = useAuth();
  const { language, t, formatNumber } = useI18n();

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: progressApi.dashboard,
  });

  const { data: levels, isLoading: isLevelsLoading } = useQuery({
    queryKey: ['levels'],
    queryFn: contentApi.levels,
  });

  const currentLevel = levels?.find(
    l => l.level_number === (profile?.current_hsk_level ?? 1),
  );
  const currentLevelTitle = currentLevel ? getLevelTitle(currentLevel, language) : '';
  const greeting =
    new Date().getHours() < 12
      ? t('home.goodMorning')
      : new Date().getHours() < 18
      ? t('home.goodAfternoon')
      : t('home.goodEvening');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {greeting}, {user?.display_name ?? t('home.learner')}
        </Text>
        <Text style={styles.subGreeting}>{t('home.ready')}</Text>
      </View>

      {isDashboardLoading ? (
        <ScreenState
          type="loading"
          title={t('home.loadingProgress')}
          compact
          style={styles.state}
        />
      ) : isDashboardError ? (
        <ScreenState
          type="error"
          title={t('home.progressUnavailable')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => {
            refetchDashboard();
          }}
          compact
          style={styles.state}
        />
      ) : (
        <Card style={styles.progressCard}>
          <View style={styles.row}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                HSK {dashboard?.current_hsk_level ?? 1}
              </Text>
            </View>
            <Text style={styles.progressLabel}>
              {t('home.lessonsCompleted', {
                count: formatNumber(dashboard?.lessons_completed ?? 0),
              })}
            </Text>
          </View>
          <ProgressBar
            progress={dashboard ? dashboard.current_level_progress_percent : 0}
          />
        </Card>
      )}

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color={colors.tertiary} />
          <Text style={styles.statLabel}>{t('home.dailyGoal')}</Text>
          <Text style={styles.statValue}>
            {dashboard?.minutes_studied_today ?? 0}/
            {dashboard?.daily_goal_minutes ?? 30}{' '}
            <Text style={styles.statUnit}>{t('common.minutesShort')}</Text>
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <Ionicons name="flame" size={24} color={colors.secondary} />
          <Text style={styles.statLabel}>{t('home.studyStreak')}</Text>
          <Text style={styles.statValue}>
            {formatNumber(dashboard?.study_streak_days ?? 0)} {t('common.days')}
          </Text>
        </Card>
      </View>

      {isLevelsLoading ? (
        <ScreenState
          type="loading"
          title={t('home.loadingLessons')}
          compact
          style={styles.state}
        />
      ) : currentLevel ? (
        <Pressable
          onPress={() =>
            navigation.navigate('LessonList', {
              levelId: currentLevel.id,
              levelTitle: currentLevelTitle,
              levelTitleTranslations: currentLevel.title_translations,
            })
          }
          accessibilityRole="button"
          accessibilityLabel={t('home.continueHsk', { level: currentLevel.level_number })}
        >
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>{t('home.nextLesson')}</Text>
            <Text style={styles.heroTitle}>
              {t('home.continueHsk', { level: currentLevel.level_number })}
            </Text>
            <View style={styles.heroButton}>
              <Text style={styles.heroButtonText}>{t('home.continueLesson')}</Text>
              <Ionicons name="play" size={18} color={colors.primary} />
            </View>
          </View>
        </Pressable>
      ) : (
        <ScreenState
          type="empty"
          title={t('home.noCurrentLevel')}
          message={t('home.updateLevel')}
          compact
          style={styles.state}
        />
      )}

      <Text style={styles.sectionTitle}>{t('home.focusAreas')}</Text>
      <View style={styles.focusGrid}>
        {FOCUS_AREAS.map(area => {
          const disabled = !('route' in area) && !currentLevel;
          const label = t(area.labelKey);
          return (
            <Pressable
              key={area.labelKey}
              style={[styles.focusItem, disabled && styles.focusDisabled]}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ disabled }}
              accessibilityLabel={label}
              onPress={() => {
                if ('route' in area && area.route) {
                  navigation.navigate(area.route);
                } else if (currentLevel && 'type' in area) {
                  navigation.push('LessonList', {
                    levelId: currentLevel.id,
                    levelTitle: currentLevelTitle,
                    levelTitleTranslations: currentLevel.title_translations,
                    lessonType: area.type,
                    focusLabel: label,
                  });
                }
              }}
            >
              <View style={styles.focusIcon}>
                <Ionicons name={area.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.focusLabel}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 100 },
  header: { marginBottom: spacing.stackLg },
  greeting: { ...typography.headlineLgMobile, color: colors.onSurface },
  subGreeting: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  state: { marginBottom: spacing.stackMd },
  progressCard: { marginBottom: spacing.stackMd },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.stackSm,
    marginBottom: spacing.stackMd,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { ...typography.labelSm, color: colors.onPrimary },
  progressLabel: {
    ...typography.labelMd,
    color: colors.onSurface,
    flex: 1,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.stackMd,
    marginBottom: spacing.stackLg,
  },
  statCard: { flex: 1 },
  statLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
  },
  statValue: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: 4,
  },
  statUnit: { ...typography.labelSm, color: colors.onSurfaceVariant },
  hero: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    padding: spacing.cardPadding,
    marginBottom: spacing.stackLg,
  },
  heroLabel: {
    ...typography.labelSm,
    color: colors.onPrimaryContainer,
    letterSpacing: 1,
  },
  heroTitle: {
    ...typography.headlineLgMobile,
    color: colors.onPrimaryContainer,
    marginVertical: 8,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLowest,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  heroButtonText: { ...typography.labelMd, color: colors.primary },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
  },
  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  focusItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.stackMd,
  },
  focusDisabled: { opacity: 0.45 },
  focusIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  focusLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
    textAlign: 'center',
  },
});
