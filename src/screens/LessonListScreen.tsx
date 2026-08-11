import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useLayoutEffect } from 'react';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { contentApi } from '../api/endpoints';
import { Card } from '../components/Card';
import { Ionicons } from '../components/Icon';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { getLessonDescription, getLessonTitle, localizeText } from '../i18n/content';
import { getLessonTypeLabel } from '../i18n/lessonTypes';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];
type Route = RouteProp<RootStackParamList, 'LessonList'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const TYPE_ICONS: Record<string, IoniconName> = {
  vocabulary: 'language',
  grammar: 'document-text',
  reading: 'book',
  listening: 'headset',
  sentence_pattern: 'text',
  conversation: 'chatbubbles',
  review: 'refresh',
  practice: 'fitness',
  quiz: 'help-circle',
  writing: 'create',
  mixed: 'layers',
};

export function LessonListScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { language, t, formatNumber } = useI18n();
  const localizedFocusLabel = params.lessonType
    ? getLessonTypeLabel(params.lessonType, t)
    : params.focusLabel;
  const levelTitle = localizeText(
    params.levelTitleTranslations,
    language,
    params.levelTitle,
  );

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({
        queryKey: ['lessons', params.levelId, params.lessonType],
      });
    }, [queryClient, params.levelId, params.lessonType]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localizedFocusLabel ?? levelTitle,
    });
  }, [navigation, localizedFocusLabel, levelTitle]);

  const {
    data: lessons,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['lessons', params.levelId, params.lessonType],
    queryFn: () => contentApi.lessons(params.levelId, params.lessonType),
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Client-side filter fallback (in case API cache or old server ignores lesson_type)
  const filteredLessons = params.lessonType
    ? lessons?.filter(l => l.lesson_type === params.lessonType)
    : lessons;

  const emptyMessage = params.lessonType
    ? t('lessonList.noTypedLessons', {
        type: localizedFocusLabel ?? getLessonTypeLabel(params.lessonType, t),
      })
    : t('lessonList.noLessons');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>
        {localizedFocusLabel
          ? `${localizedFocusLabel} · ${levelTitle}`
          : t('lessonList.selectLesson')}
      </Text>

      {isLoading ? (
        <ScreenState type="loading" title={t('home.loadingLessons')} />
      ) : isError ? (
        <ScreenState
          type="error"
          title={t('lessonList.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => {
            refetch();
          }}
        />
      ) : !filteredLessons?.length ? (
        <ScreenState
          type="empty"
          title={t('lessonList.nothingHere')}
          message={emptyMessage}
          actionLabel={t('common.reload')}
          onAction={() => {
            refetch();
          }}
        />
      ) : (
        filteredLessons.map(lesson => {
          const title = getLessonTitle(lesson, language);
          const description = getLessonDescription(lesson, language);
          return (
          <Pressable
            key={lesson.id}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${formatNumber(lesson.duration_minutes)} ${t('common.minutesUnit')}`}
            onPress={() =>
              navigation.navigate('LessonDetail', {
                lessonId: lesson.id,
                lessonTitle: title,
                lessonTitleTranslations: lesson.title_translations,
              })
            }
          >
            <Card style={styles.lessonCard}>
              <View style={styles.row}>
                <Ionicons
                  name={TYPE_ICONS[lesson.lesson_type] ?? 'book-outline'}
                  size={22}
                  color={colors.primary}
                  style={styles.icon}
                />
                <Text style={styles.lessonTitle}>{title}</Text>
                {lesson.status === 'completed' && (
                  <View style={styles.doneBadge}>
                    <Text style={styles.doneText}>{t('lessonList.done')}</Text>
                  </View>
                )}
              </View>
              {description ? (
                <Text style={styles.description} numberOfLines={2}>
                  {description}
                </Text>
              ) : null}
              <View style={styles.meta}>
                <Text style={styles.metaText}>{getLessonTypeLabel(lesson.lesson_type, t)}</Text>
                <Text style={styles.metaText}>
                  {formatNumber(lesson.duration_minutes)} {t('common.minutesShort')}
                </Text>
                {lesson.score_percent != null && (
                  <Text style={styles.score}>{lesson.score_percent}%</Text>
                )}
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
  lessonCard: { marginBottom: spacing.stackMd },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: spacing.stackSm },
  lessonTitle: { ...typography.headlineMd, color: colors.onSurface, flex: 1 },
  doneBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  doneText: { ...typography.labelSm, color: colors.onSecondaryContainer },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.stackMd,
    marginTop: spacing.stackSm,
  },
  metaText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'capitalize',
  },
  score: { ...typography.labelSm, color: colors.primary },
});
