import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { learningApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MockTestsScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();

  const { data: tests, isLoading } = useQuery({
    queryKey: ['mockTests'],
    queryFn: learningApi.mockTests,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Simulate the HSK exam with timed practice. Your target level is HSK{' '}
        {profile?.target_hsk_level ?? 1}.
      </Text>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        tests?.map((test) => (
          <Pressable
            key={test.id}
            onPress={() =>
              navigation.navigate('MockTestSession', {
                mockTestId: test.id,
                title: test.title,
                hskLevel: test.hsk_level,
                durationMinutes: test.duration_minutes,
              })
            }
          >
            <Card style={styles.testCard}>
              <Text style={styles.testTitle}>{test.title}</Text>
              <View style={styles.meta}>
                <Text style={styles.metaText}>{test.duration_minutes} min</Text>
                <Text style={styles.metaText}>{test.question_count} questions</Text>
              </View>
              <Text style={styles.start}>Tap to start</Text>
            </Card>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile },
  intro: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackLg },
  testCard: { marginBottom: spacing.stackMd },
  testTitle: { ...typography.headlineMd, color: colors.onSurface },
  meta: { flexDirection: 'row', gap: spacing.stackMd, marginTop: spacing.stackSm },
  metaText: { ...typography.labelMd, color: colors.onSurfaceVariant },
  start: { ...typography.labelMd, color: colors.primary, marginTop: spacing.stackMd },
});
