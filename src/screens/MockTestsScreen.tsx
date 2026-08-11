import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { learningApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { getMockTestTitle } from '../i18n/content';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MockTestsScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
  const { language, t, formatNumber } = useI18n();

  const { data: tests, isLoading, isError, refetch } = useQuery({
    queryKey: ['mockTests'],
    queryFn: learningApi.mockTests,
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        {t('mockTests.intro', { level: profile?.target_hsk_level ?? 1 })}
      </Text>

      {isLoading ? (
        <ScreenState type="loading" title={t('mockTests.loading')} />
      ) : isError ? (
        <ScreenState
          type="error"
          title={t('mockTests.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => {
            refetch();
          }}
        />
      ) : !tests?.length ? (
        <ScreenState
          type="empty"
          title={t('mockTests.empty')}
          message={t('mockTests.emptyMessage')}
        />
      ) : (
        tests?.map((test) => {
          const title = getMockTestTitle(test, language);
          return (
          <Pressable
            key={test.id}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${formatNumber(test.duration_minutes)} ${t('common.minutesUnit')}, ${formatNumber(test.question_count)} ${t('common.questions')}`}
            onPress={() =>
              navigation.navigate('MockTestSession', {
                mockTestId: test.id,
                title,
                titleTranslations: test.title_translations,
                hskLevel: test.hsk_level,
                durationMinutes: test.duration_minutes,
              })
            }
          >
            <Card style={styles.testCard}>
              <Text style={styles.testTitle}>{title}</Text>
              <View style={styles.meta}>
                <Text style={styles.metaText}>
                  {formatNumber(test.duration_minutes)} {t('common.minutesShort')}
                </Text>
                <Text style={styles.metaText}>
                  {formatNumber(test.question_count)} {t('common.questions')}
                </Text>
              </View>
              <Text style={styles.start}>{t('mockTests.tapStart')}</Text>
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
  content: { padding: spacing.marginMobile },
  intro: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackLg },
  testCard: { marginBottom: spacing.stackMd },
  testTitle: { ...typography.headlineMd, color: colors.onSurface },
  meta: { flexDirection: 'row', gap: spacing.stackMd, marginTop: spacing.stackSm },
  metaText: { ...typography.labelMd, color: colors.onSurfaceVariant },
  start: { ...typography.labelMd, color: colors.primary, marginTop: spacing.stackMd },
});
