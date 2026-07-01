import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { LessonDetailScreen } from '../screens/LessonDetailScreen';
import { LessonListScreen } from '../screens/LessonListScreen';
import { DailyReviewScreen } from '../screens/DailyReviewScreen';
import { MockTestsScreen } from '../screens/MockTestsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { QuizResultScreen } from '../screens/QuizResultScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { SavedWordsScreen } from '../screens/SavedWordsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { colors } from '../theme';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isLoading, isAuthenticated, profile } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || isLoading) {
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
            <Stack.Screen name="LessonList" component={LessonListScreen} options={{ title: 'Lessons' }} />
            <Stack.Screen name="LessonDetail" component={LessonDetailScreen} options={{ title: 'Lesson' }} />
            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
            <Stack.Screen name="QuizResult" component={QuizResultScreen} options={{ title: 'Results' }} />
            <Stack.Screen name="SavedWords" component={SavedWordsScreen} options={{ title: 'Saved Words' }} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Achievements' }} />
            <Stack.Screen name="MockTests" component={MockTestsScreen} options={{ title: 'Mock Tests' }} />
            <Stack.Screen name="DailyReview" component={DailyReviewScreen} options={{ title: 'Daily Review' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
