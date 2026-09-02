import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { TextInput } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { practiceApi } from '../src/api/endpoints';
import type { PracticeQuestion } from '../src/api/types';
import { QuestionFeedback } from '../src/components/practice/QuestionFeedback';
import { QuestionRenderer } from '../src/components/practice/QuestionRenderer';
import { I18nProvider } from '../src/i18n/I18nContext';
import { WritingPracticeScreen } from '../src/screens/WritingPracticeScreen';
import { countChineseCharacters } from '../src/utils/writing';

const mockPopToTop = jest.fn();
let mockRouteParams: Record<string, unknown> = {};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ popToTop: mockPopToTop }),
  useRoute: () => ({ params: mockRouteParams }),
}));

function wrap(element: React.ReactElement, queryClient?: QueryClient) {
  const content = <I18nProvider>{element}</I18nProvider>;
  return queryClient ? <QueryClientProvider client={queryClient}>{content}</QueryClientProvider> : content;
}

const guidedQuestion: PracticeQuestion = {
  id: 1,
  exercise_id: 1,
  question_type: 'GUIDED_WRITING',
  prompt: 'Write a sentence using 学习.',
  difficulty: 1,
  points: 1,
  order: 1,
  config: {
    required_vocabulary: ['学习'],
    min_characters: 5,
    max_characters: 30,
    placeholder: '我每天学习中文。',
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  mockRouteParams = { lessonId: 1, lessonTitle: 'Writing', lessonTitleTranslations: undefined };
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('counts Chinese characters only', () => {
  expect(countChineseCharacters('我 study 中文')).toBe(3);
});

test('guided writing renders native input and character count', async () => {
  const onChange = jest.fn();
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(wrap(
      <QuestionRenderer question={guidedQuestion} answer="我学习中文" onChange={onChange} />,
    ));
  });

  const input = tree!.root.findByType(TextInput);
  input.props.onChangeText('我每天学习中文');
  const text = JSON.stringify(tree!.toJSON());
  expect(text).toContain('5 Chinese characters');
  expect(text).toContain('Vocabulary targets');
  expect(onChange).toHaveBeenCalledWith('我每天学习中文');
  await ReactTestRenderer.act(async () => tree!.unmount());
});

test('writing feedback shows structured criteria', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(wrap(
      <QuestionFeedback
        correct
        correctAnswer={null}
        writingEvaluation={{
          kind: 'GUIDED_WRITING',
          label: 'STRUCTURED_EVALUATION',
          criteria: [{ key: 'required_vocabulary', passed: true, score: 100 }],
          character_count: 7,
        }}
      />,
    ));
  });

  const text = JSON.stringify(tree!.toJSON());
  expect(text).toContain('Structured evaluation');
  expect(text).toContain('Required vocabulary');
  await ReactTestRenderer.act(async () => tree!.unmount());
});

test('writing practice starts a writing-only practice session', async () => {
  jest.spyOn(practiceApi, 'createSession').mockResolvedValue({
    id: 10,
    lesson_id: 1,
    exercise_set_id: 1,
    status: 'IN_PROGRESS',
    started_at: '2026-08-15T09:00:00Z',
    completed_at: null,
    total_questions: 1,
    answered_questions: 0,
    correct_answers: 0,
    score: 0,
    time_spent_seconds: 0,
    questions: [guidedQuestion],
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(wrap(<WritingPracticeScreen />, queryClient));
  });

  expect(practiceApi.createSession).toHaveBeenCalledWith({ lesson_id: 1, skill: 'WRITING', resume: true });
  expect(JSON.stringify(tree!.toJSON())).toContain('Write a sentence using 学习.');
  await ReactTestRenderer.act(async () => tree!.unmount());
  queryClient.clear();
});
