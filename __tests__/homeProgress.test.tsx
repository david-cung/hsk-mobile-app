import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { contentApi, gamificationApi, progressApi } from '../src/api/endpoints';
import { I18nProvider } from '../src/i18n/I18nContext';
import { HomeScreen } from '../src/screens/HomeScreen';

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'learner@example.com', display_name: 'Learner' },
    profile: { current_hsk_level: 1 },
  }),
}));

jest.mock('../src/navigation/useRootNavigation', () => ({
  useRootNavigation: () => ({
    navigate: jest.fn(),
    push: jest.fn(),
  }),
}));

test('home screen renders progress summary and recommendation', async () => {
  jest.spyOn(progressApi, 'summary').mockResolvedValue({
    current_hsk_level: 1,
    target_hsk_level: 2,
    overall_progress_percent: 68,
    today_study_minutes: 24,
    today_questions: 18,
    today_accuracy: 78,
    current_streak_days: 4,
    longest_streak_days: 7,
    cards_due: 3,
    cards_overdue: 1,
    cards_reviewed_today: 2,
    review_retention: 80,
    review_streak_days: 2,
    exams_attempted: 1,
    exams_completed: 1,
    exam_best_score: 82,
    exam_latest_score: 82,
    exam_average_score: 82,
    exam_section_performance: [],
    weak_skills: [],
    recommended_practice: [{ type: 'LISTENING_PRACTICE', target_label: 'Listening', reason: 'Listening needs practice.', activity_type: 'PRACTICE' }],
    continue_learning: { lesson_id: 10, lesson_title: 'Lesson 10', hsk_level: 1, lesson_type: 'listening' },
    skill_overview: [{ skill: 'LISTENING', attempts: 6, correct: 4, accuracy: 67, study_minutes: 12, practiced: true }],
  });
  jest.spyOn(contentApi, 'levels').mockResolvedValue([
    { id: 1, level_number: 1, title: 'HSK 1', description: null, total_characters: 150 },
  ]);
  jest.spyOn(gamificationApi, 'profile').mockResolvedValue({
    xp: 120,
    level: 2,
    xp_into_level: 20,
    xp_to_next_level: 130,
    level_xp_required: 150,
    progress_percent: 13.33,
    streak_days: 4,
    longest_streak_days: 7,
    timezone: 'Asia/Ho_Chi_Minh',
    daily_goal_type: 'minutes',
    daily_goal_target: 30,
    daily_goal_current: 24,
    daily_goal_completed: false,
    today_xp: 20,
    today_minutes: 24,
    today_exercises: 18,
    today_lessons: 1,
    today_reviews: 3,
    today: '2026-01-01',
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <HomeScreen />
        </I18nProvider>
      </QueryClientProvider>,
    );
  });

  const text = JSON.stringify(tree!.toJSON());
  expect(text).toContain('68% complete');
  expect(text).toContain('Level 2');
  expect(text).toContain('130 XP to next level');
  expect(text).toContain('Recommended Practice');
  expect(text).toContain('Listening needs practice.');
  await ReactTestRenderer.act(async () => {
    tree!.unmount();
  });
  queryClient.clear();
});
