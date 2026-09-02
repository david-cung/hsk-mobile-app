import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { CourseListScreen } from '../screens/CourseListScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { GrammarDetailScreen } from '../screens/GrammarDetailScreen';
import { LessonDetailScreen } from '../screens/LessonDetailScreen';
import { LessonListScreen } from '../screens/LessonListScreen';
import { DailyReviewScreen } from '../screens/DailyReviewScreen';
import { MockExamDetailScreen } from '../screens/MockExamDetailScreen';
import { MockExamResultScreen } from '../screens/MockExamResultScreen';
import { MockTestsScreen } from '../screens/MockTestsScreen';
import { MockTestSessionScreen } from '../screens/MockTestSessionScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PracticeResultScreen } from '../screens/PracticeResultScreen';
import { PracticeSessionScreen } from '../screens/PracticeSessionScreen';
import { QuizResultScreen } from '../screens/QuizResultScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { SavedWordsScreen } from '../screens/SavedWordsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { VocabularyDetailScreen } from '../screens/VocabularyDetailScreen';
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
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ title: t('auth.forgotPassword') }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{ title: t('auth.resetPassword') }}
            />
          </>
        ) : needsOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="CourseList" component={CourseListScreen} options={{ title: t('nav.courses') }} />
            <Stack.Screen name="LessonList" component={LessonListScreen} options={{ title: t('nav.lessons') }} />
            <Stack.Screen name="LessonDetail" component={LessonDetailScreen} options={{ title: t('nav.lesson') }} />
            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: t('nav.quiz') }} />
            <Stack.Screen name="QuizResult" component={QuizResultScreen} options={{ title: t('nav.results') }} />
            <Stack.Screen name="PracticeSession" component={PracticeSessionScreen} options={{ title: t('nav.practice') }} />
            <Stack.Screen name="PracticeResult" component={PracticeResultScreen} options={{ title: t('nav.results') }} />
            <Stack.Screen name="WritingPractice" component={WritingPracticeScreen} options={{ title: t('nav.writing') }} />
            <Stack.Screen name="WritingResult" component={WritingResultScreen} options={{ title: t('nav.results') }} />
            <Stack.Screen name="SavedWords" component={SavedWordsScreen} options={{ title: t('nav.savedWords') }} />
            <Stack.Screen name="VocabularyDetail" component={VocabularyDetailScreen} options={{ title: t('nav.vocabulary') }} />
            <Stack.Screen name="GrammarDetail" component={GrammarDetailScreen} options={{ title: t('nav.grammar') }} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: t('nav.achievements') }} />
            <Stack.Screen name="MockTests" component={MockTestsScreen} options={{ title: t('nav.mockTests') }} />
            <Stack.Screen name="MockExamDetail" component={MockExamDetailScreen} options={{ title: t('nav.mockTest') }} />
            <Stack.Screen name="MockTestSession" component={MockTestSessionScreen} options={{ title: t('nav.mockTest') }} />
            <Stack.Screen name="MockExamResult" component={MockExamResultScreen} options={{ title: t('nav.results') }} />
            <Stack.Screen name="DailyReview" component={DailyReviewScreen} options={{ title: t('nav.dailyReview') }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('nav.settings') }} />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{ title: t('auth.changePassword') }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
