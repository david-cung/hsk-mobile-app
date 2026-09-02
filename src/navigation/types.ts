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
  PracticeSession: {
    lessonId: number;
    lessonTitle: string;
    lessonTitleTranslations?: LocalizedText;
    skill?: string;
  };
  WritingPractice: {
    lessonId: number;
    lessonTitle: string;
    lessonTitleTranslations?: LocalizedText;
  };
  WritingResult: {
    sessionId: number;
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
  MockExamDetail: {
    examId: number;
    title: string;
    titleTranslations?: LocalizedText;
  };
  MockTestSession: {
    examId?: number;
    attemptId?: number;
  };
  MockExamResult: { attemptId: number };
  DailyReview: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Practice: undefined;
  Progress: undefined;
  Profile: undefined;
};
