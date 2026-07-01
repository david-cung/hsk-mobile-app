import { apiFetch } from './client';
import type {
  Achievement,
  HskLevel,
  LessonDetail,
  LessonListItem,
  MockTest,
  Profile,
  ProgressDashboard,
  Question,
  QuizSubmitResult,
  SavedWord,
  TokenResponse,
  User,
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
  me: () => apiFetch<User>('/api/v1/auth/me'),
  profile: () => apiFetch<Profile>('/api/v1/auth/me/profile'),
};

export const profileApi = {
  update: (data: Partial<Profile>) =>
    apiFetch<Profile>('/api/v1/profile', { method: 'PATCH', body: JSON.stringify(data) }),
};

export const contentApi = {
  levels: () => apiFetch<HskLevel[]>('/api/v1/content/levels', { auth: false }),
  lessons: (levelId: number, lessonType?: string) => {
    const query = lessonType ? `?lesson_type=${encodeURIComponent(lessonType)}` : '';
    return apiFetch<LessonListItem[]>(`/api/v1/content/levels/${levelId}/lessons${query}`);
  },
  lesson: (lessonId: number) => apiFetch<LessonDetail>(`/api/v1/content/lessons/${lessonId}`, { auth: false }),
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

export const progressApi = {
  dashboard: () => apiFetch<ProgressDashboard>('/api/v1/progress/dashboard'),
};

export const learningApi = {
  savedWords: () => apiFetch<SavedWord[]>('/api/v1/learning/saved-words'),
  addSavedWord: (data: { hanzi: string; pinyin?: string; meaning?: string; hsk_level?: number }) =>
    apiFetch<SavedWord>('/api/v1/learning/saved-words', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteSavedWord: (id: number) =>
    apiFetch<void>(`/api/v1/learning/saved-words/${id}`, { method: 'DELETE' }),
  achievements: () => apiFetch<Achievement[]>('/api/v1/learning/achievements'),
  mockTests: () => apiFetch<MockTest[]>('/api/v1/learning/mock-tests', { auth: false }),
};
