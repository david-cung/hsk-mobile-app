import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar, StyleSheet } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { I18nProvider } from './src/i18n/I18nContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { APP_ENV, APP_RELEASE, SENTRY_DSN } from './src/config';

if (SENTRY_DSN && APP_ENV !== 'development') {
  Sentry.init({ dsn: SENTRY_DSN, environment: APP_ENV, release: APP_RELEASE, sendDefaultPii: false });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <AuthProvider>
              <StatusBar barStyle="dark-content" backgroundColor="#fcf9f8" />
              <RootNavigator />
            </AuthProvider>
          </I18nProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  root: { flex: 1 },
});
