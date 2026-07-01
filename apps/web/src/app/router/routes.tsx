import type { RouteObject } from 'react-router-dom';

import { AuthLayout } from '@/app/layouts/AuthLayout';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { RootLayout } from '@/app/layouts/RootLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                lazy: async () => {
                  const { HomePage } = await import('@/features/home/pages/HomePage');
                  return { Component: HomePage };
                },
              },
              {
                path: 'learn',
                lazy: async () => {
                  const { LearnPage } = await import('@/features/learn/pages/LearnPage');
                  return { Component: LearnPage };
                },
              },
              {
                path: 'learn/:levelId/lessons',
                lazy: async () => {
                  const { LessonListPage } =
                    await import('@/features/lessons/pages/LessonListPage');
                  return { Component: LessonListPage };
                },
              },
              {
                path: 'practice',
                lazy: async () => {
                  const { PracticePage } = await import('@/features/practice/pages/PracticePage');
                  return { Component: PracticePage };
                },
              },
              {
                path: 'progress',
                lazy: async () => {
                  const { ProgressPage } = await import('@/features/progress/pages/ProgressPage');
                  return { Component: ProgressPage };
                },
              },
              {
                path: 'profile',
                lazy: async () => {
                  const { ProfilePage } = await import('@/features/profile/pages/ProfilePage');
                  return { Component: ProfilePage };
                },
              },
            ],
          },
          {
            path: 'lessons/:lessonId/quiz/result',
            lazy: async () => {
              const { QuizResultPage } = await import('@/features/quiz/pages/QuizResultPage');
              return { Component: QuizResultPage };
            },
          },
          {
            path: 'lessons/:lessonId/quiz',
            lazy: async () => {
              const { QuizPage } = await import('@/features/quiz/pages/QuizPage');
              return { Component: QuizPage };
            },
          },
          {
            path: 'lessons/:lessonId',
            lazy: async () => {
              const { LessonDetailPage } =
                await import('@/features/lessons/pages/LessonDetailPage');
              return { Component: LessonDetailPage };
            },
          },
          {
            path: 'profile/saved-words',
            lazy: async () => {
              const { SavedWordsPage } =
                await import('@/features/saved-words/pages/SavedWordsPage');
              return { Component: SavedWordsPage };
            },
          },
          {
            path: 'profile/achievements',
            lazy: async () => {
              const { AchievementsPage } =
                await import('@/features/achievements/pages/AchievementsPage');
              return { Component: AchievementsPage };
            },
          },
          {
            path: 'profile/daily-review',
            lazy: async () => {
              const { DailyReviewPage } =
                await import('@/features/daily-review/pages/DailyReviewPage');
              return { Component: DailyReviewPage };
            },
          },
          {
            path: 'profile/mock-tests',
            lazy: async () => {
              const { MockTestsPage } = await import('@/features/mock-tests/pages/MockTestsPage');
              return { Component: MockTestsPage };
            },
          },
          {
            path: 'profile/mock-tests/:testId',
            lazy: async () => {
              const { MockTestSessionPage } =
                await import('@/features/mock-tests/pages/MockTestSessionPage');
              return { Component: MockTestSessionPage };
            },
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            lazy: async () => {
              const { LoginPage } = await import('@/features/auth/pages/LoginPage');
              return { Component: LoginPage };
            },
          },
          {
            path: 'register',
            lazy: async () => {
              const { RegisterPage } = await import('@/features/auth/pages/RegisterPage');
              return { Component: RegisterPage };
            },
          },
        ],
      },
      {
        path: 'onboarding',
        lazy: async () => {
          const { OnboardingPage } = await import('@/features/onboarding/pages/OnboardingPage');
          return { Component: OnboardingPage };
        },
      },
      {
        path: 'settings',
        lazy: async () => {
          const { SettingsPage } = await import('@/features/settings/pages/SettingsPage');
          return { Component: SettingsPage };
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('@/app/pages/NotFoundPage');
          return { Component: NotFoundPage };
        },
      },
    ],
  },
];
