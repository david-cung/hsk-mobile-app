import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { LessonDetailScreen } from '../screens/LessonDetailScreen';
import { LessonListScreen } from '../screens/LessonListScreen';
import { DailyReviewScreen } from '../screens/DailyReviewScreen';
import { MockExamDetailScreen } from '../screens/MockExamDetailScreen';
import { MockExamResultScreen } from '../screens/MockExamResultScreen';
import { MockTestsScreen } from '../screens/MockTestsScreen';
import { MockTestSessionScreen } from '../screens/MockTestSessionScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { QuizResultScreen } from '../screens/QuizResultScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { PracticeSessionScreen } from '../screens/PracticeSessionScreen';
import { SavedWordsScreen } from '../screens/SavedWordsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { WritingPracticeScreen } from '../screens/WritingPracticeScreen';
import { WritingResultScreen } from '../screens/WritingResultScreen';
import { colors } from '../theme';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isLoading, isAuthenticated, profile } = useAuth();
  const { isLoading: isLanguageLoading, t } = useI18n();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || isLoading || isLanguageLoading) {
    return <SplashScreen />;
  }

  const needsOnboarding = isAuthenticated && profile && !profile.onboarding_completed;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
          </>
        ) : needsOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="LessonList" component={LessonListScreen} options={{ title: t('nav.lessons') }} />
            <Stack.Screen name="LessonDetail" component={LessonDetailScreen} options={{ title: t('nav.lesson') }} />
            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: t('nav.quiz') }} />
            <Stack.Screen name="PracticeSession" component={PracticeSessionScreen} options={{ title: t('nav.practice') }} />
            <Stack.Screen name="WritingPractice" component={WritingPracticeScreen} options={{ title: t('nav.writing') }} />
            <Stack.Screen name="WritingResult" component={WritingResultScreen} options={{ title: t('nav.results') }} />
            <Stack.Screen name="QuizResult" component={QuizResultScreen} options={{ title: t('nav.results') }} />
            <Stack.Screen name="SavedWords" component={SavedWordsScreen} options={{ title: t('nav.savedWords') }} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: t('nav.achievements') }} />
            <Stack.Screen name="MockTests" component={MockTestsScreen} options={{ title: t('nav.mockTests') }} />
            <Stack.Screen name="MockExamDetail" component={MockExamDetailScreen} options={{ title: t('nav.mockTest') }} />
            <Stack.Screen name="MockTestSession" component={MockTestSessionScreen} options={{ title: t('nav.mockTest') }} />
            <Stack.Screen name="MockExamResult" component={MockExamResultScreen} options={{ title: t('nav.results') }} />
            <Stack.Screen name="DailyReview" component={DailyReviewScreen} options={{ title: t('nav.dailyReview') }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('nav.settings') }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
