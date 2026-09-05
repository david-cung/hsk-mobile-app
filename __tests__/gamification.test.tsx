import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { gamificationApi, notificationApi } from '../src/api/endpoints';
import { I18nProvider } from '../src/i18n/I18nContext';
import { AchievementsScreen } from '../src/screens/AchievementsScreen';
import { DailyGoalScreen } from '../src/screens/DailyGoalScreen';
import { SettingsScreen } from '../src/screens/SettingsScreen';

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'learner@example.com', display_name: 'Learner' },
    profile: {
      current_hsk_level: 1,
      target_hsk_level: 2,
      daily_goal_minutes: 30,
      daily_goal_type: 'minutes',
      study_streak_days: 4,
      timezone: 'Asia/Ho_Chi_Minh',
    },
    refreshProfile: jest.fn(),
    deleteAccount: jest.fn(),
  }),
}));

jest.mock('../src/navigation/useRootNavigation', () => ({
  useRootNavigation: () => ({
    navigate: jest.fn(),
    push: jest.fn(),
  }),
}));

function renderWithClient(element: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const tree = ReactTestRenderer.create(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>{element}</I18nProvider>
    </QueryClientProvider>,
  );
  return { tree, queryClient };
}

function renderedText(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root
    .findAllByType(Text)
    .flatMap(node => node.props.children)
    .join(' ');
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('daily goal screen renders current goal progress', async () => {
  jest.spyOn(gamificationApi, 'daily').mockResolvedValue({
    date: '2026-01-01',
    timezone: 'Asia/Ho_Chi_Minh',
    xp: 20,
    minutes: 24,
    exercises: 18,
    lessons: 1,
    reviews: 3,
    goal_type: 'minutes',
    goal_target: 30,
    goal_current: 24,
    goal_completed: false,
    streak_days: 4,
  });
  jest.spyOn(gamificationApi, 'updateDaily').mockResolvedValue({
    date: '2026-01-01',
    timezone: 'Asia/Ho_Chi_Minh',
    xp: 20,
    minutes: 24,
    exercises: 18,
    lessons: 1,
    reviews: 3,
    goal_type: 'minutes',
    goal_target: 45,
    goal_current: 24,
    goal_completed: false,
    streak_days: 4,
  });

  let rendered: ReturnType<typeof renderWithClient>;
  await ReactTestRenderer.act(async () => {
    rendered = renderWithClient(<DailyGoalScreen />);
  });

  const text = renderedText(rendered!.tree);
  expect(text).toContain('Daily Goal');
  expect(text).toContain('24 / 30 min');
  expect(text).toContain("Today's Activity");

  await ReactTestRenderer.act(async () => {
    rendered!.tree.unmount();
  });
  rendered!.queryClient.clear();
});

test('achievements screen shows locked progress', async () => {
  jest.spyOn(gamificationApi, 'achievements').mockResolvedValue([
    {
      id: 1,
      code: 'first_lesson',
      title: 'First Lesson',
      description: 'Complete your first lesson.',
      icon: 'book',
      earned: true,
      earned_at: '2026-01-01T00:00:00Z',
      progress: { current: 1, target: 1 },
    },
    {
      id: 2,
      code: 'first_100_xp',
      title: 'First 100 XP',
      description: 'Earn your first 100 XP.',
      icon: 'star',
      earned: false,
      earned_at: null,
      progress: { current: 20, target: 100 },
    },
  ]);

  let rendered: ReturnType<typeof renderWithClient>;
  await ReactTestRenderer.act(async () => {
    rendered = renderWithClient(<AchievementsScreen />);
  });

  const text = renderedText(rendered!.tree);
  expect(text).toContain('First Lesson');
  expect(text).toContain('20 / 100');

  await ReactTestRenderer.act(async () => {
    rendered!.tree.unmount();
  });
  rendered!.queryClient.clear();
});

test('settings screen renders notification preferences', async () => {
  jest.spyOn(notificationApi, 'preferences').mockResolvedValue({
    daily_reminder: true,
    streak_reminder: true,
    srs_reminder: true,
    exam_reminder: false,
    achievement_notification: true,
  });
  jest.spyOn(notificationApi, 'updatePreferences').mockResolvedValue({
    daily_reminder: false,
    streak_reminder: true,
    srs_reminder: true,
    exam_reminder: false,
    achievement_notification: true,
  });

  let rendered: ReturnType<typeof renderWithClient>;
  await ReactTestRenderer.act(async () => {
    rendered = renderWithClient(<SettingsScreen />);
  });

  const text = renderedText(rendered!.tree);
  expect(text).toContain('Notifications');
  expect(text).toContain('Daily reminder');
  expect(text).toContain('Achievement notification');

  await ReactTestRenderer.act(async () => {
    rendered!.tree.unmount();
  });
  rendered!.queryClient.clear();
});
