export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  LessonList: {
    levelId: number;
    levelTitle: string;
    lessonType?: string;
    focusLabel?: string;
  };
  LessonDetail: { lessonId: number; lessonTitle: string };
  Quiz: { lessonId: number; lessonTitle: string };
  QuizResult: {
    lessonId: number;
    lessonTitle: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
  };
  SavedWords: undefined;
  Achievements: undefined;
  MockTests: undefined;
  DailyReview: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Practice: undefined;
  Progress: undefined;
  Profile: undefined;
};
