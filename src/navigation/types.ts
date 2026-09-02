import type { LocalizedText, QuestionResult } from '../api/types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string } | undefined;
  ChangePassword: undefined;
  Main: undefined;
  CourseList: {
    levelId: number;
    levelTitle: string;
    levelTitleTranslations?: LocalizedText;
  };
  LessonList: {
    levelId?: number;
    levelTitle?: string;
    levelTitleTranslations?: LocalizedText;
    courseId?: number;
    courseTitle?: string;
    courseTitleTranslations?: LocalizedText;
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
  PracticeResult: {
    sessionId: number;
    lessonId: number;
    lessonTitle: string;
    lessonTitleTranslations?: LocalizedText;
  };
  WritingPractice: {
    lessonId: number;
    lessonTitle: string;
    lessonTitleTranslations?: LocalizedText;
  };
  WritingResult: { sessionId: number };
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
  VocabularyDetail: { vocabularyId: number; title: string };
  GrammarDetail: { grammarId: number; title: string };
  Achievements: undefined;
  MockTests: undefined;
  MockExamDetail: {
    examId: number;
    title: string;
    titleTranslations?: LocalizedText;
  };
  MockTestSession: {
    mockTestId?: number;
    examId?: number;
    attemptId?: number;
    title?: string;
    titleTranslations?: LocalizedText;
    hskLevel?: number;
    durationMinutes?: number;
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
