import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import {
  contentApi,
  grammarApi,
  progressApi,
  vocabularyApi,
} from '../src/api/endpoints';
import { CourseListScreen } from '../src/screens/CourseListScreen';
import { GrammarDetailScreen } from '../src/screens/GrammarDetailScreen';
import { LessonDetailScreen } from '../src/screens/LessonDetailScreen';
import { LessonListScreen } from '../src/screens/LessonListScreen';
import { VocabularyDetailScreen } from '../src/screens/VocabularyDetailScreen';


let mockRouteParams: Record<string, unknown> = {};
const mockNavigation = {
  navigate: jest.fn(),
  push: jest.fn(),
  setOptions: jest.fn(),
  getParent: jest.fn(() => null),
};

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: mockRouteParams }),
  useNavigation: () => mockNavigation,
  useFocusEffect: () => undefined,
}));

jest.mock('../src/i18n/I18nContext', () => ({
  useI18n: () => ({
    language: 'en',
    t: (key: string, values?: Record<string, unknown>) =>
      values?.count ? `${key}:${values.count}` : key,
    formatNumber: (value: number) => String(value),
  }),
}));

jest.mock('../src/api/endpoints', () => ({
  contentApi: {
    courses: jest.fn(),
    courseLessons: jest.fn(),
    lessons: jest.fn(),
    lesson: jest.fn(),
  },
  progressApi: {
    startLesson: jest.fn(async () => ({})),
  },
  learningApi: {
    addSavedWord: jest.fn(async () => ({})),
  },
  vocabularyApi: {
    detail: jest.fn(),
    favorite: jest.fn(async () => ({})),
    unfavorite: jest.fn(async () => undefined),
    viewed: jest.fn(async () => ({})),
    updateStatus: jest.fn(async () => ({})),
  },
  grammarApi: {
    detail: jest.fn(),
    viewed: jest.fn(async () => ({})),
    complete: jest.fn(async () => ({})),
  },
}));

const mockedContentApi = jest.mocked(contentApi);
const mockedProgressApi = jest.mocked(progressApi);
const mockedVocabularyApi = jest.mocked(vocabularyApi);
const mockedGrammarApi = jest.mocked(grammarApi);

function render(component: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  return ReactTestRenderer.create(
    <QueryClientProvider client={client}>{component}</QueryClientProvider>,
  );
}

async function settle() {
  await ReactTestRenderer.act(async () => {
    await new Promise(resolve => setTimeout(resolve, 20));
  });
}

describe('Phase 4 content screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = {};
  });

  it('renders course loading, empty, error, and loaded states', async () => {
    mockRouteParams = { levelId: 1, levelTitle: 'HSK 1' };
    mockedContentApi.courses.mockImplementationOnce(
      () => new Promise(() => undefined),
    );
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = render(<CourseListScreen />);
    });
    expect(JSON.stringify(tree!.toJSON())).toContain('courseList.loading');
    await ReactTestRenderer.act(() => tree!.unmount());

    mockedContentApi.courses.mockResolvedValueOnce([]);
    await ReactTestRenderer.act(() => {
      tree = render(<CourseListScreen />);
    });
    await settle();
    expect(JSON.stringify(tree!.toJSON())).toContain('courseList.empty');
    await ReactTestRenderer.act(() => tree!.unmount());

    mockedContentApi.courses.mockRejectedValueOnce(new Error('offline'));
    await ReactTestRenderer.act(() => {
      tree = render(<CourseListScreen />);
    });
    await settle();
    expect(JSON.stringify(tree!.toJSON())).toContain('courseList.couldNotLoad');
    await ReactTestRenderer.act(() => tree!.unmount());

    mockedContentApi.courses.mockResolvedValueOnce([
      {
        id: 10,
        hsk_level_id: 1,
        hsk_level: 1,
        title: 'HSK 1 Vocabulary',
        description: 'Core words',
        thumbnail_url: null,
        course_type: 'vocabulary',
        order: 1,
        status: 'published',
        lesson_count: 15,
      },
    ]);
    await ReactTestRenderer.act(() => {
      tree = render(<CourseListScreen />);
    });
    await settle();
    expect(JSON.stringify(tree!.toJSON())).toContain('HSK 1 Vocabulary');
    expect(mockedContentApi.courses).toHaveBeenLastCalledWith(1);
    await ReactTestRenderer.act(() => tree!.unmount());
  });

  it('loads lessons from the selected course', async () => {
    mockRouteParams = {
      levelId: 1,
      levelTitle: 'HSK 1',
      courseId: 10,
      courseTitle: 'Vocabulary',
    };
    mockedContentApi.courseLessons.mockResolvedValueOnce([
      {
        id: 100,
        course_id: 10,
        title: 'Greetings',
        description: 'Learn greetings',
        lesson_type: 'vocabulary',
        sort_order: 1,
        duration_minutes: 10,
        status: null,
        score_percent: null,
      },
    ]);
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = render(<LessonListScreen />);
    });
    await settle();
    expect(mockedContentApi.courseLessons).toHaveBeenCalledWith(10);
    expect(JSON.stringify(tree!.toJSON())).toContain('Greetings');
    await ReactTestRenderer.act(() => tree!.unmount());
  });

  it('renders normalized vocabulary and grammar in lesson detail', async () => {
    mockRouteParams = { lessonId: 100, lessonTitle: 'Core lesson' };
    mockedContentApi.lesson.mockResolvedValueOnce({
      id: 100,
      hsk_level_id: 1,
      course_id: 10,
      title: 'Core lesson',
      description: 'Introduction',
      lesson_type: 'mixed',
      duration_minutes: 10,
      content: {
        vocabulary: [
          {
            id: 7,
            hanzi: '你好',
            pinyin: 'ni3 hao3',
            meaning: 'hello',
            hsk_level: 1,
          },
        ],
        grammar_points: [
          {
            id: 8,
            title: '吗 questions',
            structure: 'Statement + 吗？',
            explanation: 'Forms a yes/no question.',
            examples: [],
          },
        ],
      },
    });
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = render(<LessonDetailScreen />);
    });
    await settle();
    const output = JSON.stringify(tree!.toJSON());
    expect(output).toContain('你好');
    expect(output).toContain('吗 questions');
    expect(mockedProgressApi.startLesson).toHaveBeenCalledWith(100);
    await ReactTestRenderer.act(() => tree!.unmount());
  });

  it('renders vocabulary and grammar detail data', async () => {
    mockRouteParams = { vocabularyId: 7, title: '你好' };
    mockedVocabularyApi.detail.mockResolvedValueOnce({
      id: 7,
      simplified: '你好',
      traditional: '你好',
      pinyin: 'ni3 hao3',
      meaning_translations: { en: 'hello', vi: 'xin chào' },
      part_of_speech: 'phrase',
      hsk_level: 1,
      hsk_level_id: 1,
      difficulty: 1,
      display_order: 1,
      audio: null,
      learning_status: 'new',
      is_favorite: false,
      category: 'Greetings',
      examples: [
        {
          id: 1,
          chinese: '你好！',
          pinyin: 'ni3 hao3',
          translations: { en: 'Hello!' },
          audio: null,
        },
      ],
      lessons: [],
      status: 'published',
    });
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = render(<VocabularyDetailScreen />);
    });
    await settle();
    expect(JSON.stringify(tree!.toJSON())).toContain('你好！');
    expect(mockedVocabularyApi.viewed).toHaveBeenCalledWith(7);
    await ReactTestRenderer.act(() => tree!.unmount());

    mockRouteParams = { grammarId: 8, title: '吗 questions' };
    mockedGrammarApi.detail.mockResolvedValueOnce({
      id: 8,
      title: '吗 questions',
      explanation_translations: { en: 'Forms a yes/no question.' },
      pattern: 'Statement + 吗？',
      hsk_level: 1,
      hsk_level_id: 1,
      difficulty: 1,
      display_order: 1,
      learning_status: null,
      examples: [],
      lessons: [],
      status: 'published',
    });
    await ReactTestRenderer.act(() => {
      tree = render(<GrammarDetailScreen />);
    });
    await settle();
    expect(JSON.stringify(tree!.toJSON())).toContain('Statement + 吗？');
    expect(mockedGrammarApi.viewed).toHaveBeenCalledWith(8);
    await ReactTestRenderer.act(() => tree!.unmount());
  });
});
