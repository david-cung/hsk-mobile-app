import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/AuthContext';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { colors, radius, spacing, typography } from '../theme';

const MENU = [
  { label: 'Daily Review', icon: 'refresh-outline' as const, route: 'DailyReview' as const },
  { label: 'Saved Words', icon: 'bookmark-outline' as const, route: 'SavedWords' as const },
  { label: 'Achievements', icon: 'trophy-outline' as const, route: 'Achievements' as const },
  { label: 'Mock Tests', icon: 'document-text-outline' as const, route: 'MockTests' as const },
  { label: 'Settings', icon: 'settings-outline' as const, route: 'Settings' as const },
];

export function ProfileScreen() {
  const { user, profile, logout } = useAuth();
  const navigation = useRootNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(user?.display_name ?? 'U')[0].toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{user?.display_name ?? 'Learner'}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>HSK {profile?.current_hsk_level ?? 1}</Text>
          <Text style={styles.statLabel}>Current</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{profile?.study_streak_days ?? 0}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{profile?.daily_goal_minutes ?? 30}m</Text>
          <Text style={styles.statLabel}>Daily Goal</Text>
        </View>
      </View>

      {MENU.map((item) => (
        <Pressable
          key={item.route}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.route)}
        >
          <Ionicons name={item.icon} size={22} color={colors.onSurface} />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
        </Pressable>
      ))}

      <Pressable style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out</Text>
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
