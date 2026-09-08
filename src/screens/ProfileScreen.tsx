import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { colors, radius, spacing, typography } from '../theme';
import { AI_TUTOR_ENABLED } from '../config';

const MENU = [
  { labelKey: 'nav.aiTutor' as const, icon: 'chatbubbles-outline' as const, route: 'AiTutor' as const },
  { labelKey: 'dailyGoal.title' as const, icon: 'flag-outline' as const, route: 'DailyGoal' as const },
  { labelKey: 'nav.dailyReview' as const, icon: 'refresh-outline' as const, route: 'DailyReview' as const },
  { labelKey: 'nav.savedWords' as const, icon: 'bookmark-outline' as const, route: 'SavedWords' as const },
  { labelKey: 'nav.achievements' as const, icon: 'trophy-outline' as const, route: 'Achievements' as const },
  { labelKey: 'nav.mockTests' as const, icon: 'document-text-outline' as const, route: 'MockTests' as const },
  { labelKey: 'nav.settings' as const, icon: 'settings-outline' as const, route: 'Settings' as const },
];

export function ProfileScreen() {
  const { user, profile, logout } = useAuth();
  const { t } = useI18n();
  const navigation = useRootNavigation();
  const confirmLogout = () => {
    Alert.alert(t('profile.signOutQuestion'), t('profile.signOutMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.signOut'),
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(user?.display_name ?? 'U')[0].toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{user?.display_name ?? t('home.learner')}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>HSK {profile?.current_hsk_level ?? 1}</Text>
          <Text style={styles.statLabel}>{t('profile.current')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{profile?.study_streak_days ?? 0}</Text>
          <Text style={styles.statLabel}>{t('profile.streak')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{profile?.daily_goal_minutes ?? 30}m</Text>
          <Text style={styles.statLabel}>{t('profile.dailyGoal')}</Text>
        </View>
      </View>

      {MENU.filter(item => AI_TUTOR_ENABLED || item.route !== 'AiTutor').map((item) => (
        <Pressable
          key={item.route}
          style={styles.menuItem}
          accessibilityRole="button"
          accessibilityLabel={t(item.labelKey)}
          onPress={() => navigation.navigate(item.route)}
        >
          <Ionicons name={item.icon} size={22} color={colors.onSurface} />
          <Text style={styles.menuLabel}>{t(item.labelKey)}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
        </Pressable>
      ))}

      <Pressable style={styles.logout} accessibilityRole="button" onPress={confirmLogout}>
        <Text style={styles.logoutText}>{t('profile.signOut')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 100, alignItems: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.stackLg,
  },
  avatarText: { fontSize: 32, color: colors.onPrimaryContainer, fontWeight: '700' },
  name: { ...typography.headlineLgMobile, color: colors.onSurface, marginTop: spacing.stackMd },
  email: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  stats: {
    flexDirection: 'row',
    marginVertical: spacing.stackLg,
    gap: spacing.stackLg,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stat: { alignItems: 'center' },
  statValue: { ...typography.headlineMd, color: colors.primary },
  statLabel: { ...typography.labelSm, color: colors.onSurfaceVariant },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    marginBottom: spacing.stackSm,
    gap: spacing.stackMd,
  },
  menuLabel: { ...typography.bodyMd, color: colors.onSurface, flex: 1 },
  logout: { marginTop: spacing.stackLg, padding: spacing.stackMd },
  logoutText: { ...typography.labelMd, color: colors.error },
});
