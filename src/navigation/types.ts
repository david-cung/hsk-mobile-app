import type { LocalizedText, QuestionResult } from '../api/types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  LessonList: {
    levelId: number;
    levelTitle: string;
    levelTitleTranslations?: LocalizedText;
    lessonType?: string;
    focusLabel?: string;
  };
  LessonDetail: {
    lessonId: number;
    lessonTitle: string;
    lessonTitleTranslations?: LocalizedText;
  };
  Quiz: {
    lessonId: number;
    lessonTitle: string;
    lessonTitleTranslations?: LocalizedText;
  };
  QuizResult: {
    lessonId: number;
    lessonTitle: string;
    lessonTitleTranslations?: LocalizedText;
    score: number;
    correctCount: number;
    totalQuestions: number;
    results?: QuestionResult[];
    source?: 'lesson' | 'mock';
    mockTestId?: number;
    hskLevel?: number;
    durationMinutes?: number;
  };
  SavedWords: undefined;
  Achievements: undefined;
  MockTests: undefined;
  MockTestSession: {
    mockTestId: number;
    title: string;
    titleTranslations?: LocalizedText;
    hskLevel: number;
    durationMinutes: number;
  };
  DailyReview: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Practice: undefined;
  Progress: undefined;
  Profile: undefined;
};
