import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { contentApi, gamificationApi, progressApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenState } from '../components/ScreenState';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { getLevelTitle } from '../i18n/content';
import { getLessonTypeLabel } from '../i18n/lessonTypes';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { colors, spacing, typography } from '../theme';
import { AI_TUTOR_ENABLED } from '../config';

const FOCUS_AREAS = [
  { labelKey: 'lessonType.mixed' as const, icon: 'layers' as const, type: 'mixed' },
  { labelKey: 'lessonType.vocabulary' as const, icon: 'language' as const, type: 'vocabulary' },
  { labelKey: 'lessonType.grammar' as const, icon: 'document-text' as const, type: 'grammar' },
  { labelKey: 'lessonType.listening' as const, icon: 'headset' as const, type: 'listening' },
  { labelKey: 'lessonType.reading' as const, icon: 'book' as const, type: 'reading' },
  { labelKey: 'lessonType.patterns' as const, icon: 'text' as const, type: 'sentence_pattern' },
  { labelKey: 'lessonType.conversation' as const, icon: 'chatbubbles' as const, type: 'conversation' },
  { labelKey: 'lessonType.practice' as const, icon: 'fitness' as const, type: 'practice' },
  { labelKey: 'nav.mockTest' as const, icon: 'help-circle' as const, route: 'MockTests' as const },
];

export function HomeScreen() {
  const navigation = useRootNavigation();
  const { user, profile } = useAuth();
  const { language, t, formatNumber } = useI18n();
  const summaryQuery = useQuery({ queryKey: ['progress-summary'], queryFn: progressApi.summary });
  const gamificationQuery = useQuery({
    queryKey: ['gamification-profile'],
    queryFn: gamificationApi.profile,
  });
  const { data: levels, isLoading: isLevelsLoading } = useQuery({ queryKey: ['levels'], queryFn: contentApi.levels });
  const summary = summaryQuery.data;
  const gamification = gamificationQuery.data;
  const currentLevel = levels?.find(level => level.level_number === (summary?.current_hsk_level ?? profile?.current_hsk_level ?? 1));
  const currentLevelTitle = currentLevel ? getLevelTitle(currentLevel, language) : '';
  const greeting =
    new Date().getHours() < 12 ? t('home.goodMorning') : new Date().getHours() < 18 ? t('home.goodAfternoon') : t('home.goodEvening');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}, {user?.display_name ?? t('home.learner')}</Text>
        <Text style={styles.subGreeting}>{t('home.ready')}</Text>
      </View>

      {summaryQuery.isLoading ? (
        <ScreenState type="loading" title={t('home.loadingProgress')} compact style={styles.state} />
      ) : summaryQuery.isError ? (
        <ScreenState
          type="error"
          title={t('home.progressUnavailable')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => summaryQuery.refetch()}
          compact
          style={styles.state}
        />
      ) : (
        <Card style={styles.progressCard}>
          <View style={styles.row}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HSK {summary?.current_hsk_level ?? 1}</Text>
            </View>
            <Text style={styles.progressLabel}>
              {t('progress.overallComplete', { percent: formatNumber(Math.round(summary?.overall_progress_percent ?? 0)) })}
            </Text>
          </View>
          <ProgressBar progress={summary?.overall_progress_percent ?? 0} />
        </Card>
      )}

      {gamificationQuery.isLoading ? (
        <ScreenState type="loading" title={t('gamification.loading')} compact style={styles.state} />
      ) : gamificationQuery.isError ? (
        <ScreenState
          type="error"
          title={t('gamification.unavailable')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => gamificationQuery.refetch()}
          compact
          style={styles.state}
        />
      ) : gamification ? (
        <Card style={styles.gamificationCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelBadge}>
              <Ionicons name="sparkles" size={18} color={colors.onPrimary} />
              <Text style={styles.levelBadgeText}>
                {t('gamification.level', { level: formatNumber(gamification.level) })}
              </Text>
            </View>
            <Text style={styles.xpText}>
              {t('gamification.totalXp', { xp: formatNumber(gamification.xp) })}
            </Text>
          </View>
          <ProgressBar progress={gamification.progress_percent} color={colors.secondary} />
          <Text style={styles.goalHint}>
            {t('gamification.xpToNext', {
              xp: formatNumber(gamification.xp_to_next_level),
            })}
          </Text>
          <View style={styles.goalRow}>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>{t('home.studyStreak')}</Text>
              <Text style={styles.goalValue}>
                {t('gamification.daysValue', { count: formatNumber(gamification.streak_days) })}
              </Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>{t('home.dailyGoal')}</Text>
              <Text style={styles.goalValue}>
                {t('gamification.goalProgress', {
                  current: formatNumber(gamification.daily_goal_current),
                  target: formatNumber(gamification.daily_goal_target),
                })}
              </Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>{t('gamification.todayXp')}</Text>
              <Text style={styles.goalValue}>{formatNumber(gamification.today_xp)}</Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <Button
              title={t('dailyGoal.title')}
              leftIcon="flag-outline"
              variant="secondary"
              onPress={() => navigation.navigate('DailyGoal')}
              style={styles.actionButton}
            />
            <Button
              title={t('nav.achievements')}
              leftIcon="trophy-outline"
              variant="ghost"
              onPress={() => navigation.navigate('Achievements')}
              style={styles.actionButton}
            />
          </View>
        </Card>
      ) : null}

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color={colors.tertiary} />
          <Text style={styles.statLabel}>{t('progress.todayStudy')}</Text>
          <Text style={styles.statValue}>
            {formatNumber(summary?.today_study_minutes ?? 0)} <Text style={styles.statUnit}>{t('common.minutesShort')}</Text>
          </Text>
          <Text style={styles.statHint}>{t('progress.todayQuestions', { count: formatNumber(summary?.today_questions ?? 0) })}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Ionicons name="flame" size={24} color={colors.secondary} />
          <Text style={styles.statLabel}>{t('home.studyStreak')}</Text>
          <Text style={styles.statValue}>{formatNumber(summary?.current_streak_days ?? 0)} {t('common.days')}</Text>
          <Text style={styles.statHint}>{t('progress.longestStreak', { count: formatNumber(summary?.longest_streak_days ?? 0) })}</Text>
        </Card>
      </View>

      {summary ? (
        <Card style={styles.analyticsCard}>
          <Text style={styles.cardTitle}>{t('nav.dailyReview')}</Text>
          <Text style={styles.recommendationReason}>
            {summary.cards_due > 0
              ? t('dailyReview.dueCount', { count: formatNumber(summary.cards_due) })
              : t('dailyReview.empty')}
          </Text>
          <Button
            title={t('dailyReview.reviewNow')}
            leftIcon="refresh-outline"
            variant={summary.cards_due > 0 ? 'primary' : 'secondary'}
            onPress={() => navigation.navigate('DailyReview')}
            style={styles.reviewButton}
          />
        </Card>
      ) : null}

      {AI_TUTOR_ENABLED ? <Card style={styles.analyticsCard}>
        <Text style={styles.cardTitle}>{t('nav.aiTutor')}</Text>
        <Text style={styles.recommendationReason}>{t('home.aiTutor')}</Text>
        <Button
          title={t('home.startTutor')}
          leftIcon="chatbubbles-outline"
          onPress={() => navigation.navigate('AiTutor')}
          style={styles.reviewButton}
        />
      </Card> : null}

      {summary?.skill_overview?.length ? (
        <Card style={styles.analyticsCard}>
          <Text style={styles.cardTitle}>{t('progress.skillOverview')}</Text>
          {summary.skill_overview.slice(0, 5).map(skill => {
            const score = skill.skill === 'SPEAKING' ? skill.average_score : skill.accuracy;
            return (
              <View key={skill.skill} style={styles.skillRow}>
                <Text style={styles.skillName}>{getLessonTypeLabel(skill.skill.toLowerCase(), t)}</Text>
                <Text style={styles.skillScore}>{score == null ? t('progress.notPracticed') : `${formatNumber(Math.round(score))}%`}</Text>
              </View>
            );
          })}
        </Card>
      ) : null}

      {summary?.recommended_practice?.length ? (
        <Card style={styles.analyticsCard}>
          <Text style={styles.cardTitle}>{t('progress.recommendedPractice')}</Text>
          <Text style={styles.recommendationTitle}>{summary.recommended_practice[0].target_label ?? summary.recommended_practice[0].type}</Text>
          <Text style={styles.recommendationReason}>{summary.recommended_practice[0].reason}</Text>
        </Card>
      ) : null}

      {isLevelsLoading ? (
        <ScreenState type="loading" title={t('home.loadingLessons')} compact style={styles.state} />
      ) : summary?.continue_learning?.lesson_id ? (
        <Pressable
          onPress={() => navigation.navigate('LessonDetail', {
            lessonId: summary.continue_learning!.lesson_id!,
            lessonTitle: summary.continue_learning!.lesson_title ?? t('home.continueLesson'),
            lessonTitleTranslations: summary.continue_learning!.lesson_title_translations,
          })}
          accessibilityRole="button"
          accessibilityLabel={t('home.continueLesson')}
        >
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>{t('home.nextLesson')}</Text>
            <Text style={styles.heroTitle}>{summary.continue_learning.lesson_title}</Text>
            <View style={styles.heroButton}>
              <Text style={styles.heroButtonText}>{t('home.continueLesson')}</Text>
              <Ionicons name="play" size={18} color={colors.primary} />
            </View>
          </View>
        </Pressable>
      ) : currentLevel ? (
        <Pressable
          onPress={() => navigation.navigate('LessonList', {
            levelId: currentLevel.id,
            levelTitle: currentLevelTitle,
            levelTitleTranslations: currentLevel.title_translations,
          })}
          accessibilityRole="button"
          accessibilityLabel={t('home.continueHsk', { level: currentLevel.level_number })}
        >
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>{t('home.nextLesson')}</Text>
            <Text style={styles.heroTitle}>{t('home.continueHsk', { level: currentLevel.level_number })}</Text>
            <View style={styles.heroButton}>
              <Text style={styles.heroButtonText}>{t('home.continueLesson')}</Text>
              <Ionicons name="play" size={18} color={colors.primary} />
            </View>
          </View>
        </Pressable>
      ) : null}

      {summary?.weak_skills?.length ? (
        <Card style={styles.analyticsCard}>
          <Text style={styles.cardTitle}>{t('progress.weakAreas')}</Text>
          {summary.weak_skills.slice(0, 3).map(area => (
            <Text key={`${area.type}-${area.skill}-${area.target_id ?? area.label}`} style={styles.weakItem}>
              {area.label}: {area.metric == null ? area.reason : `${formatNumber(Math.round(area.metric))}%`}
            </Text>
          ))}
        </Card>
      ) : null}

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
  subGreeting: { ...typography.labelMd, color: colors.onSurfaceVariant, marginTop: 4 },
  state: { marginBottom: spacing.stackMd },
  progressCard: { marginBottom: spacing.stackMd },
  gamificationCard: { marginBottom: spacing.stackMd },
  analyticsCard: { marginBottom: spacing.stackMd },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.stackSm, marginBottom: spacing.stackMd },
  badge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  badgeText: { ...typography.labelSm, color: colors.onPrimary },
  progressLabel: { ...typography.labelMd, color: colors.onSurface, flex: 1, textAlign: 'right' },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.stackSm,
    marginBottom: spacing.stackSm,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  levelBadgeText: { ...typography.labelMd, color: colors.onPrimary },
  xpText: { ...typography.labelMd, color: colors.onSurface },
  goalHint: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  goalRow: { flexDirection: 'row', gap: spacing.stackSm, marginTop: spacing.stackMd },
  goalItem: { flex: 1 },
  goalLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  goalValue: { ...typography.labelMd, color: colors.onSurface, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: spacing.stackSm, marginTop: spacing.stackMd },
  actionButton: { flex: 1, paddingHorizontal: 10 },
  statsRow: { flexDirection: 'row', gap: spacing.stackMd, marginBottom: spacing.stackMd },
  statCard: { flex: 1 },
  statLabel: { ...typography.labelMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
  statValue: { ...typography.headlineMd, color: colors.onSurface, marginTop: 4 },
  statUnit: { ...typography.labelSm, color: colors.onSurfaceVariant },
  statHint: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 2 },
  cardTitle: { ...typography.labelMd, color: colors.onSurface, marginBottom: spacing.stackSm },
  skillRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  skillName: { ...typography.bodyMd, color: colors.onSurface },
  skillScore: { ...typography.labelMd, color: colors.primary },
  recommendationTitle: { ...typography.bodyMd, color: colors.onSurface },
  recommendationReason: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 4 },
  reviewButton: { alignSelf: 'flex-start', marginTop: spacing.stackMd },
  weakItem: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 },
  hero: { backgroundColor: colors.primaryContainer, borderRadius: 16, padding: spacing.cardPadding, marginBottom: spacing.stackLg },
  heroLabel: { ...typography.labelSm, color: colors.onPrimaryContainer, letterSpacing: 1 },
  heroTitle: { ...typography.headlineLgMobile, color: colors.onPrimaryContainer, marginVertical: 8 },
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
  sectionTitle: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackMd },
  focusGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  focusItem: { width: '30%', alignItems: 'center', marginBottom: spacing.stackMd },
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
  focusLabel: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 4, textAlign: 'center' },
});
