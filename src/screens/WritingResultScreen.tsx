import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { View, StyleSheet } from 'react-native';

import { practiceApi } from '../api/endpoints';
import { PracticeResult } from '../components/practice/PracticeResult';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import type { RootStackParamList } from '../navigation/types';
import { spacing } from '../theme';

type Route = RouteProp<RootStackParamList, 'WritingResult'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function WritingResultScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { t } = useI18n();
  const query = useQuery({
    queryKey: ['writing-result', params.sessionId],
    queryFn: () => practiceApi.results(params.sessionId),
  });

  if (query.isLoading) {
    return <View style={styles.center}><ScreenState type="loading" title={t('writing.loadingResult')} /></View>;
  }
  if (query.isError || !query.data) {
    return (
      <View style={styles.center}>
        <ScreenState
          type="error"
          title={t('writing.couldNotLoadResult')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => query.refetch()}
        />
      </View>
    );
  }
  return <PracticeResult results={query.data} onDone={() => navigation.popToTop()} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.marginMobile },
});
