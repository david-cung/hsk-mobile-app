import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, View } from 'react-native';

import { practiceApi } from '../api/endpoints';
import { Button } from '../components/Button';
import { PracticeResult } from '../components/practice/PracticeResult';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';

type Route = RouteProp<RootStackParamList, 'PracticeResult'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function PracticeResultScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { t } = useI18n();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['practiceResults', params.sessionId],
    queryFn: () => practiceApi.results(params.sessionId),
    retry: false,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title={t('practiceResult.loading')} />
      </View>
    );
  }
  if (isError || !data) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('practiceResult.couldNotLoad')}
          message={error instanceof Error ? error.message : t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => refetch()}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PracticeResult results={data} />
      <Button
        title={t('practiceResult.tryAgain')}
        leftIcon="refresh-outline"
        onPress={() =>
          navigation.replace('PracticeSession', {
            lessonId: params.lessonId,
            lessonTitle: params.lessonTitle,
            lessonTitleTranslations: params.lessonTitleTranslations,
          })
        }
      />
      <Button
        title={t('quizResult.backToLessons')}
        variant="ghost"
        leftIcon="list-outline"
        onPress={() => navigation.popToTop()}
        style={styles.secondary}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.marginMobile,
  },
  secondary: { marginTop: spacing.stackMd },
});
