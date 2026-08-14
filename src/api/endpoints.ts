import { apiFetch } from './client';
import type {
  Achievement,
  Course,
  GrammarDetail,
  HskLevel,
  LessonDetail,
  LessonListItem,
  Mistake,
  MockTest,
  MockTestQuestion,
  PracticeAnswer,
  PracticeAnswerResult,
  PracticeResults,
  PracticeSession,
  Profile,
  ProfileUpdate,
  ProgressDashboard,
  Question,
  QuizSubmitResult,
  SavedWord,
  TokenResponse,
  User,
  VocabularyDetail,
  VocabularyPage,
} from './types';

export const authApi = {
  register: (email: string, password: string, display_name?: string) =>
    apiFetch<TokenResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name }),
      auth: false,
    }),
  login: (email: string, password: string) =>
    apiFetch<TokenResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    }),
  google: (idToken: string) =>
    apiFetch<TokenResponse>('/api/v1/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
      auth: false,
    }),
  refresh: (refreshToken: string) =>
    apiFetch<TokenResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      auth: false,
    }),
  logout: (refreshToken: string) =>
    apiFetch<void>('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      auth: false,
    }),
  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      auth: false,
    }),
  resetPassword: (token: string, newPassword: string) =>
    apiFetch<void>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
      auth: false,
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<void>('/api/v1/auth/password', {
      method: 'PATCH',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }),
  deleteAccount: () => apiFetch<void>('/api/v1/auth/me', { method: 'DELETE' }),
  me: () => apiFetch<User>('/api/v1/auth/me'),
  profile: () => apiFetch<Profile>('/api/v1/auth/me/profile'),
};

export const profileApi = {
  update: (data: ProfileUpdate) =>
    apiFetch<Profile>('/api/v1/profile', { method: 'PATCH', body: JSON.stringify(data) }),
};

export const contentApi = {
  levels: () => apiFetch<HskLevel[]>('/api/v1/hsk/levels', { auth: false }),
  courses: (levelId: number) =>
    apiFetch<Course[]>(`/api/v1/courses?hsk_level_id=${levelId}`, { auth: false }),
  courseLessons: (courseId: number) =>
    apiFetch<LessonListItem[]>(`/api/v1/courses/${courseId}/lessons`),
  lessons: (levelId: number, lessonType?: string) => {
    const query = lessonType ? `?lesson_type=${encodeURIComponent(lessonType)}` : '';
    return apiFetch<LessonListItem[]>(`/api/v1/content/levels/${levelId}/lessons${query}`);
  },
  lesson: (lessonId: number) =>
    apiFetch<LessonDetail>(`/api/v1/lessons/${lessonId}`, { auth: false }),
  questions: (lessonId: number) =>
    apiFetch<Question[]>(`/api/v1/content/lessons/${lessonId}/questions`, { auth: false }),
};

export const quizApi = {
  submit: (lessonId: number, answers: Record<string, string>) =>
    apiFetch<QuizSubmitResult>(`/api/v1/quiz/lessons/${lessonId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
};

export const practiceApi = {
  startSession: (data: {
    lesson_id: number;
    exercise_set_id?: number;
    question_count?: number;
    difficulty?: number;
    skill?: string;
    resume?: boolean;
  }) =>
    apiFetch<PracticeSession>('/api/v1/practice/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  session: (sessionId: number) =>
    apiFetch<PracticeSession>(`/api/v1/practice/sessions/${sessionId}`),
  answer: (
    sessionId: number,
    data: {
      question_id: number;
      answer: PracticeAnswer;
      idempotency_key: string;
      time_spent_seconds: number;
    },
  ) =>
    apiFetch<PracticeAnswerResult>(`/api/v1/practice/sessions/${sessionId}/answers`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  complete: (sessionId: number) =>
    apiFetch<PracticeResults>(`/api/v1/practice/sessions/${sessionId}/complete`, {
      method: 'POST',
    }),
  results: (sessionId: number) =>
    apiFetch<PracticeResults>(`/api/v1/practice/sessions/${sessionId}/results`),
};

export const progressApi = {
  dashboard: () => apiFetch<ProgressDashboard>('/api/v1/progress/dashboard'),
  startLesson: (lessonId: number) =>
    apiFetch(`/api/v1/lessons/${lessonId}/start`, { method: 'POST' }),
  completeLesson: (lessonId: number) =>
    apiFetch(`/api/v1/lessons/${lessonId}/complete`, { method: 'POST' }),
};

export const vocabularyApi = {
  detail: (id: number) => apiFetch<VocabularyDetail>(`/api/v1/vocabulary/${id}`),
  list: (params: string = '') =>
    apiFetch<VocabularyPage>(`/api/v1/vocabulary${params ? `?${params}` : ''}`),
  favorite: (id: number) =>
    apiFetch<VocabularyDetail>(`/api/v1/vocabulary/${id}/favorite`, {
      method: 'POST',
    }),
  unfavorite: (id: number) =>
    apiFetch<void>(`/api/v1/vocabulary/${id}/favorite`, { method: 'DELETE' }),
  viewed: (id: number) =>
    apiFetch(`/api/v1/vocabulary/${id}/view`, { method: 'POST' }),
  updateStatus: (id: number, status: 'new' | 'learning' | 'learned' | 'mastered') =>
    apiFetch(`/api/v1/vocabulary/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export const grammarApi = {
  detail: (id: number) => apiFetch<GrammarDetail>(`/api/v1/grammar/${id}`),
  viewed: (id: number) =>
    apiFetch(`/api/v1/grammar/${id}/view`, { method: 'POST' }),
  complete: (id: number) =>
    apiFetch(`/api/v1/grammar/${id}/complete`, { method: 'POST' }),
};

export const learningApi = {
  savedWords: () => apiFetch<SavedWord[]>('/api/v1/learning/saved-words'),
  mistakes: () => apiFetch<Mistake[]>('/api/v1/learning/mistakes'),
  addSavedWord: (data: { hanzi: string; pinyin?: string; meaning?: string; hsk_level?: number }) =>
    apiFetch<SavedWord>('/api/v1/learning/saved-words', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteSavedWord: (id: number) =>
    apiFetch<void>(`/api/v1/learning/saved-words/${id}`, { method: 'DELETE' }),
  achievements: () => apiFetch<Achievement[]>('/api/v1/learning/achievements'),
  mockTests: () => apiFetch<MockTest[]>('/api/v1/learning/mock-tests', { auth: false }),
  mockTestQuestions: (id: number) =>
    apiFetch<MockTestQuestion[]>(`/api/v1/learning/mock-tests/${id}/questions`),
  submitMockTest: (id: number, answers: Record<string, string>) =>
    apiFetch<QuizSubmitResult>(`/api/v1/learning/mock-tests/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
};
