import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { examApi } from '../src/api/endpoints';
import { I18nProvider } from '../src/i18n/I18nContext';
import { MockExamDetailScreen } from '../src/screens/MockExamDetailScreen';
import { MockExamResultScreen } from '../src/screens/MockExamResultScreen';
import { MockTestSessionScreen } from '../src/screens/MockTestSessionScreen';
import { MockTestsScreen } from '../src/screens/MockTestsScreen';

const mockNavigate = jest.fn();
const mockReplace = jest.fn();
let mockRouteParams: Record<string, unknown> = {};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, replace: mockReplace }),
  useRoute: () => ({ params: mockRouteParams }),
}));

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ profile: { target_hsk_level: 1 } }),
}));

function wrap(element: React.ReactElement, queryClient: QueryClient) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>{element}</I18nProvider>
    </QueryClientProvider>
  );
}

const attempt = {
  attempt_id: 11,
  exam_id: 1,
  exam_version: 1,
  status: 'IN_PROGRESS',
  title: 'HSK 1 Mock',
  hsk_level: 1,
  duration_minutes: 30,
  sections: [{ type: 'VOCABULARY', title: 'Vocabulary', duration_minutes: 30, question_count: 1 }],
  questions: [{
    id: 101,
    exercise_id: null,
    question_type: 'MULTIPLE_CHOICE',
    prompt: 'Choose hello',
    difficulty: 1,
    points: 1,
    order: 1,
    section: 'VOCABULARY',
    section_index: 0,
    question_index: 0,
    config: { options: [{ id: '1', text: '你好' }, { id: '2', text: '谢谢' }] },
  }],
  answers: {},
  server_time: '2026-08-15T09:00:00Z',
  started_at: '2026-08-15T09:00:00Z',
  expires_at: new Date(Date.now() + 60_000).toISOString(),
  remaining_seconds: 60,
  allow_previous_section: true,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockRouteParams = {};
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('mock exam list renders exams and history', async () => {
  jest.spyOn(examApi, 'list').mockResolvedValue([{
    id: 1,
    title: 'HSK 1 Mock',
    hsk_level: 1,
    exam_type: 'MOCK',
    duration_minutes: 30,
    question_count: 1,
    sections: [{ type: 'VOCABULARY', title: 'Vocabulary', duration_minutes: 30, question_count: 1 }],
    attempt_count: 1,
    best_percentage: 80,
    status: 'PUBLISHED',
  }]);
  jest.spyOn(examApi, 'history').mockResolvedValue([{ attempt_id: 11, exam_id: 1, title: 'HSK 1 Mock', hsk_level: 1, status: 'SUBMITTED', percentage: 80, score: 1, started_at: '2026-08-15T09:00:00Z' }]);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(wrap(<MockTestsScreen />, queryClient));
  });

  const text = JSON.stringify(tree!.toJSON());
  expect(text).toContain('HSK 1 Mock');
  expect(text).toContain('Best score');
  await ReactTestRenderer.act(async () => tree!.unmount());
  queryClient.clear();
});

test('mock exam detail starts an attempt', async () => {
  mockRouteParams = { examId: 1, title: 'HSK 1 Mock' };
  jest.spyOn(examApi, 'detail').mockResolvedValue({
    id: 1,
    title: 'HSK 1 Mock',
    hsk_level: 1,
    exam_type: 'MOCK',
    duration_minutes: 30,
    question_count: 1,
    sections: [{ type: 'VOCABULARY', title: 'Vocabulary', duration_minutes: 30, question_count: 1 }],
    attempt_count: 0,
    status: 'PUBLISHED',
    availability: 'AVAILABLE',
    instructions: 'Timer cannot be paused.',
  });
  jest.spyOn(examApi, 'start').mockResolvedValue(attempt);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(wrap(<MockExamDetailScreen />, queryClient));
  });
  const startButton = tree!.root.findAllByProps({ accessibilityRole: 'button' }).find(button => button.props.accessibilityLabel === 'Start Exam');
  await ReactTestRenderer.act(async () => startButton!.props.onPress());

  expect(mockReplace).toHaveBeenCalledWith('MockTestSession', { attemptId: 11 });
  await ReactTestRenderer.act(async () => tree!.unmount());
  queryClient.clear();
});

test('mock exam session autosaves and submits', async () => {
  mockRouteParams = { attemptId: 11 };
  jest.spyOn(examApi, 'attempt').mockResolvedValue(attempt);
  jest.spyOn(examApi, 'saveAnswer').mockResolvedValue({ ...attempt, answers: { '101': '1' } });
  jest.spyOn(examApi, 'submit').mockResolvedValue({
    attempt_id: 11,
    exam_id: 1,
    title: 'HSK 1 Mock',
    hsk_level: 1,
    status: 'SUBMITTED',
    score_label: 'Estimated Practice Score',
    raw_score: 1,
    total_points: 1,
    percentage: 100,
    started_at: '2026-08-15T09:00:00Z',
    expires_at: '2026-08-15T09:30:00Z',
    time_used_seconds: 30,
    sections: [],
    questions: [],
    weak_areas: [],
    recommended_practice: [],
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(wrap(<MockTestSessionScreen />, queryClient));
  });
  const option = tree!.root.findAllByProps({ accessibilityRole: 'radio' })[0];
  await ReactTestRenderer.act(async () => option.props.onPress());

  expect(examApi.saveAnswer).toHaveBeenCalledWith(11, 101, '1', 'exam:11:101');
  await ReactTestRenderer.act(async () => tree!.unmount());
  queryClient.clear();
});

test('mock exam result renders score and sections', async () => {
  mockRouteParams = { attemptId: 11 };
  jest.spyOn(examApi, 'result').mockResolvedValue({
    attempt_id: 11,
    exam_id: 1,
    title: 'HSK 1 Mock',
    hsk_level: 1,
    status: 'SUBMITTED',
    score_label: 'Estimated Practice Score',
    raw_score: 1,
    total_points: 1,
    percentage: 100,
    started_at: '2026-08-15T09:00:00Z',
    expires_at: '2026-08-15T09:30:00Z',
    time_used_seconds: 30,
    sections: [{ section: 'VOCABULARY', total_questions: 1, answered: 1, correct: 1, incorrect: 0, skipped: 0, raw_score: 1, percentage: 100, time_used_seconds: 30 }],
    questions: [{ question_id: 101, section: 'VOCABULARY', prompt: 'Choose hello', user_answer: '1', correct_answer: '1', correct: true, points: 1, max_points: 1 }],
    weak_areas: [],
    recommended_practice: [],
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(wrap(<MockExamResultScreen />, queryClient));
  });

  const text = JSON.stringify(tree!.toJSON());
  expect(text).toContain('100%');
  expect(text).toContain('VOCABULARY');
  await ReactTestRenderer.act(async () => tree!.unmount());
  queryClient.clear();
});
