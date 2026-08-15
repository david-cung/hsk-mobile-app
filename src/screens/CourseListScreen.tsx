import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { contentApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { Ionicons } from '../components/Icon';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { localizeText } from '../i18n/content';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Route = RouteProp<RootStackParamList, 'CourseList'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CourseListScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { language, t, formatNumber } = useI18n();
  const levelTitle = localizeText(
    params.levelTitleTranslations,
    language,
    params.levelTitle,
  );
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['courses', params.levelId],
    queryFn: () => contentApi.courses(params.levelId),
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: levelTitle });
  }, [levelTitle, navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>{t('courseList.selectCourse')}</Text>
      {isLoading ? (
        <ScreenState type="loading" title={t('courseList.loading')} />
      ) : isError ? (
        <ScreenState
          type="error"
          title={t('courseList.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => refetch()}
        />
      ) : !data?.length ? (
        <ScreenState
          type="empty"
          title={t('courseList.empty')}
          message={t('courseList.emptyMessage')}
        />
      ) : (
        data.map(course => {
          const title = localizeText(
            course.title_translations,
            language,
            course.title,
          );
          const description = localizeText(
            course.description_translations,
            language,
            course.description ?? '',
          );
          return (
            <Pressable
              key={course.id}
              accessibilityRole="button"
              accessibilityLabel={`${title}, ${formatNumber(course.lesson_count)} ${t(
                'nav.lessons',
              )}`}
              onPress={() =>
                navigation.navigate('LessonList', {
                  courseId: course.id,
                  courseTitle: title,
                  courseTitleTranslations: course.title_translations,
                  levelId: params.levelId,
                  levelTitle,
                  levelTitleTranslations: params.levelTitleTranslations,
                })
              }
            >
              <Card style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.icon}>
                    <Ionicons name="book" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.text}>
                    <Text style={styles.title}>{title}</Text>
                    {description ? (
                      <Text style={styles.description} numberOfLines={2}>
                        {description}
                      </Text>
                    ) : null}
                    <Text style={styles.meta}>
                      {t('courseList.lessonCount', {
                        count: formatNumber(course.lesson_count),
                      })}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                </View>
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
  content: { padding: spacing.marginMobile, paddingBottom: 80 },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackLg,
  },
  card: { marginBottom: spacing.stackMd },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
    marginRight: spacing.stackMd,
  },
  text: { flex: 1 },
  title: { ...typography.headlineMd, color: colors.onSurface },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
  },
  meta: {
    ...typography.labelSm,
    color: colors.primary,
    marginTop: spacing.stackSm,
  },
});
