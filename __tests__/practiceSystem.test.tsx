import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { TextInput } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { practiceApi } from '../src/api/endpoints';
import type { PracticeQuestion, PracticeSession } from '../src/api/types';
import { QuestionRenderer } from '../src/components/practice/QuestionRenderer';
import { PracticeResultScreen } from '../src/screens/PracticeResultScreen';
import { PracticeSessionScreen } from '../src/screens/PracticeSessionScreen';

let mockRouteParams: Record<string, unknown> = {};
const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  popToTop: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: mockRouteParams }),
  useNavigation: () => mockNavigation,
}));

jest.mock('../src/i18n/I18nContext', () => ({
  useI18n: () => ({
    language: 'en',
    t: (key: string, values?: Record<string, unknown>) =>
      values ? `${key}:${JSON.stringify(values)}` : key,
    formatNumber: (value: number) => String(value),
  }),
}));

jest.mock('../src/api/endpoints', () => ({
  practiceApi: {
    startSession: jest.fn(),
    session: jest.fn(),
    answer: jest.fn(),
    complete: jest.fn(),
    results: jest.fn(),
  },
}));

const mockedPracticeApi = jest.mocked(practiceApi);
const queryClients: QueryClient[] = [];

const choiceQuestion: PracticeQuestion = {
  id: 10,
  exercise_id: 20,
  question_type: 'multiple_choice',
  prompt: '你好 means:',
  explanation_available: true,
  points: 1,
  order: 1,
  configuration: {
    options: [
      { id: 'a', text: 'Hello' },
      { id: 'b', text: 'Goodbye' },
    ],
  },
};

function render(component: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false, gcTime: 0 },
    },
  });
  queryClients.push(client);
  return ReactTestRenderer.create(
    <QueryClientProvider client={client}>{component}</QueryClientProvider>,
  );
}

async function settle() {
  await ReactTestRenderer.act(async () => {
    await new Promise(resolve => setTimeout(resolve, 20));
  });
}

describe('Phase 5 practice system', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = {
      lessonId: 1,
      lessonTitle: 'Greetings',
    };
  });

  afterEach(() => {
    queryClients.splice(0).forEach(client => client.clear());
  });

  it('renders multiple choice, fill blank, and ordering inputs', async () => {
    const onChoice = jest.fn();
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = render(
        <QuestionRenderer
          question={choiceQuestion}
          onChange={onChoice}
        />,
      );
    });
    const radio = tree!.root.findAllByProps({ accessibilityRole: 'radio' })[0];
    await ReactTestRenderer.act(() => radio.props.onPress());
    expect(onChoice).toHaveBeenCalledWith('a');
    await ReactTestRenderer.act(() => tree!.unmount());

    const onText = jest.fn();
    await ReactTestRenderer.act(() => {
      tree = render(
        <QuestionRenderer
          question={{
            ...choiceQuestion,
            id: 11,
            question_type: 'fill_blank',
            configuration: {},
          }}
          onChange={onText}
        />,
      );
    });
    const input = tree!.root.findByType(TextInput);
    await ReactTestRenderer.act(() => input.props.onChangeText('好'));
    expect(onText).toHaveBeenCalledWith('好');
    await ReactTestRenderer.act(() => tree!.unmount());

    const onOrder = jest.fn();
    await ReactTestRenderer.act(() => {
      tree = render(
        <QuestionRenderer
          question={{
            ...choiceQuestion,
            id: 12,
            question_type: 'ordering',
            configuration: {
              items: [
                { id: 'one', text: '我' },
                { id: 'two', text: '学习' },
              ],
            },
          }}
          answer={[]}
          onChange={onOrder}
        />,
      );
    });
    const orderItem = tree!.root.findByProps({ accessibilityLabel: '我' });
    await ReactTestRenderer.act(() => orderItem.props.onPress());
    expect(onOrder).toHaveBeenCalledWith(['one']);
    await ReactTestRenderer.act(() => tree!.unmount());
  });

  it('submits once, shows feedback, and completes the session', async () => {
    mockedPracticeApi.startSession.mockResolvedValue({
      id: 30,
      lesson_id: 1,
      exercise_set_id: 2,
      status: 'in_progress',
      questions: [choiceQuestion],
      total_questions: 1,
      answered_questions: 0,
      answered_question_ids: [],
      correct_answers: 0,
      score: 0,
      time_spent_seconds: 0,
      started_at: '2026-08-13T00:00:00Z',
    });
    mockedPracticeApi.answer.mockResolvedValue({
      attempt_id: 40,
      question_id: 10,
      correct: true,
      score: 1,
      max_score: 1,
      submitted_answer: 'a',
      normalized_answer: 'a',
      correct_answer: 'a',
      explanation: '你好 is hello.',
      answered_questions: 1,
      correct_answers: 1,
      session_score: 100,
    });
    mockedPracticeApi.complete.mockResolvedValue({
      session_id: 30,
      status: 'completed',
      total_questions: 1,
      answered_questions: 1,
      correct_answers: 1,
      incorrect_answers: 0,
      score: 100,
      accuracy: 100,
      time_spent_seconds: 3,
      review: [],
    });

    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = render(<PracticeSessionScreen />);
    });
    await settle();
    const radio = tree!.root.findAllByProps({ accessibilityRole: 'radio' })[0];
    await ReactTestRenderer.act(() => radio.props.onPress());
    const submit = tree!.root.findByProps({
      accessibilityLabel: 'practiceSession.submit',
    });
    await ReactTestRenderer.act(() => submit.props.onPress());
    await settle();
    expect(mockedPracticeApi.answer).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(tree!.toJSON())).toContain('common.correct');

    const finish = tree!.root.findByProps({
      accessibilityLabel: 'practiceSession.finish',
    });
    await ReactTestRenderer.act(() => finish.props.onPress());
    await settle();
    expect(mockedPracticeApi.complete).toHaveBeenCalledWith(30);
    expect(mockNavigation.replace).toHaveBeenCalledWith(
      'PracticeResult',
      expect.objectContaining({ sessionId: 30 }),
    );
    await ReactTestRenderer.act(() => tree!.unmount());
  });

  it('keeps recoverable loading and session error states', async () => {
    let resolveSession!: (session: PracticeSession) => void;
    mockedPracticeApi.startSession.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveSession = resolve;
        }),
    );
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = render(<PracticeSessionScreen />);
    });
    expect(JSON.stringify(tree!.toJSON())).toContain('practiceSession.loading');
    await ReactTestRenderer.act(() => {
      resolveSession({
        id: 30,
        lesson_id: 1,
        exercise_set_id: 2,
        status: 'in_progress',
        questions: [choiceQuestion],
        total_questions: 1,
        answered_questions: 0,
        answered_question_ids: [],
        correct_answers: 0,
        score: 0,
        time_spent_seconds: 0,
        started_at: '2026-08-13T00:00:00Z',
      });
    });
    await settle();
    await ReactTestRenderer.act(() => tree!.unmount());

    mockedPracticeApi.startSession.mockRejectedValueOnce(
      new Error('Session expired'),
    );
    await ReactTestRenderer.act(() => {
      tree = render(<PracticeSessionScreen />);
    });
    await settle();
    expect(JSON.stringify(tree!.toJSON())).toContain(
      'practiceSession.couldNotStart',
    );
    expect(JSON.stringify(tree!.toJSON())).toContain('Session expired');
    await ReactTestRenderer.act(() => tree!.unmount());
  });

  it('renders the server result review', async () => {
    mockRouteParams = {
      sessionId: 30,
      lessonId: 1,
      lessonTitle: 'Greetings',
    };
    mockedPracticeApi.results.mockResolvedValueOnce({
      session_id: 30,
      status: 'completed',
      total_questions: 1,
      answered_questions: 1,
      correct_answers: 0,
      incorrect_answers: 1,
      score: 0,
      accuracy: 0,
      time_spent_seconds: 4,
      review: [
        {
          question_id: 10,
          prompt: '你好 means:',
          submitted_answer: 'b',
          correct_answer: 'a',
          correct: false,
          score: 0,
          max_score: 1,
          explanation: '你好 is hello.',
        },
      ],
    });
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = render(<PracticeResultScreen />);
    });
    await settle();
    const output = JSON.stringify(tree!.toJSON());
    expect(output).toContain('你好 means:');
    expect(output).toContain('practiceResult.review');
    expect(output).toContain('你好 is hello.');
    await ReactTestRenderer.act(() => tree!.unmount());
  });
});
