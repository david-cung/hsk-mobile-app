import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { examMetadataApi, progressApi } from '../src/api/endpoints';
import { I18nProvider } from '../src/i18n/I18nContext';
import { ProgressScreen } from '../src/screens/ProgressScreen';

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    profile: { current_hsk_level: 1 },
  }),
}));

test('progress screen renders HSK progress, skills, activity, weak areas, and recommendations', async () => {
  jest.spyOn(progressApi, 'summary').mockResolvedValue({
    current_hsk_level: 1,
    target_hsk_level: 2,
    overall_progress_percent: 50,
    today_study_minutes: 24,
    today_questions: 18,
    today_accuracy: 78,
    current_streak_days: 3,
    longest_streak_days: 5,
    cards_due: 4,
    cards_overdue: 1,
    cards_reviewed_today: 6,
    review_retention: 83,
    review_streak_days: 2,
    exams_attempted: 2,
    exams_completed: 2,
    exam_best_score: 88,
    exam_latest_score: 83,
    exam_average_score: 85.5,
    exam_section_performance: [],
    weak_skills: [{ type: 'SKILL', label: 'Listening', skill: 'LISTENING', attempts: 6, metric: 58, reason: 'Listening is below 70%.' }],
    recommended_practice: [{ type: 'LISTENING_PRACTICE', target_label: 'Listening', reason: 'Listening is below 70%.', activity_type: 'PRACTICE' }],
    continue_learning: null,
    skill_overview: [
      { skill: 'LISTENING', attempts: 6, correct: 3, accuracy: 58, study_minutes: 12, practiced: true, trend: 'stable' },
      { skill: 'SPEAKING', attempts: 2, correct: 0, accuracy: null, average_score: 82, study_minutes: 4, practiced: true },
    ],
  });
  jest.spyOn(progressApi, 'hsk').mockResolvedValue({
    level: 1,
    level_id: 1,
    title: 'HSK 1',
    vocabulary: { total: 10, completed: 5, percent: 50 },
    grammar: { total: 4, completed: 2, percent: 50 },
    lessons: { total: 6, completed: 3, percent: 50 },
    practice: { attempts: 12, correct: 8, accuracy: 66 },
    speaking: { attempts: 2, correct: 0, accuracy: null, average_score: 82 },
    skill_performance: [],
    study_minutes: 42,
  });
  jest.spyOn(progressApi, 'activity').mockResolvedValue([
    { date: '2026-08-09', study_minutes: 5, practice_attempts: 2, questions: 2, correct: 1, accuracy: 50, lessons_studied: 1, vocabulary_practiced: 0, grammar_practiced: 0, listening_practiced: 2, speaking_practiced: 0 },
    { date: '2026-08-10', study_minutes: 10, practice_attempts: 4, questions: 4, correct: 3, accuracy: 75, lessons_studied: 1, vocabulary_practiced: 0, grammar_practiced: 0, listening_practiced: 2, speaking_practiced: 2 },
  ]);
  jest.spyOn(examMetadataApi, 'revisions').mockResolvedValue([
    { id: 1, specification_id: 1, specification_code: 'TEST_SPEC', code: 'TEST_REVISION', version: '1', name: 'Test revision', status: 'published', is_default: true },
  ]);
  jest.spyOn(examMetadataApi, 'levels').mockResolvedValue([
    { id: 1, revision_id: 1, revision_code: 'TEST_REVISION', code: 'TEST_1', level_number: 1, display_name: 'HSK 1', sort_order: 1, status: 'published' },
    { id: 2, revision_id: 1, revision_code: 'TEST_REVISION', code: 'TEST_2', level_number: 2, display_name: 'HSK 2', sort_order: 2, status: 'published' },
  ]);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <ProgressScreen />
        </I18nProvider>
      </QueryClientProvider>,
    );
  });

  const text = JSON.stringify(tree!.toJSON());
  expect(text).toContain('HSK 1');
  expect(text).toContain('Skill Overview');
  expect(text).toContain('Study Activity');
  expect(text).toContain('Weak Areas');
  expect(text).toContain('Recommended Practice');
  await ReactTestRenderer.act(async () => {
    tree!.unmount();
  });
  queryClient.clear();
});
