/**
 * API route constants aligned with the FastAPI backend (`/api/v1`).
 * Path values only — no request logic.
 */
export const API_ENDPOINTS = {
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    me: '/api/v1/auth/me',
    profile: '/api/v1/auth/me/profile',
  },
  profile: {
    update: '/api/v1/profile',
  },
  content: {
    levels: '/api/v1/content/levels',
    levelLessons: (levelId: number) => `/api/v1/content/levels/${levelId}/lessons`,
    lesson: (lessonId: number) => `/api/v1/content/lessons/${lessonId}`,
    lessonQuestions: (lessonId: number) => `/api/v1/content/lessons/${lessonId}/questions`,
  },
  quiz: {
    submit: (lessonId: number) => `/api/v1/quiz/lessons/${lessonId}/submit`,
  },
  progress: {
    dashboard: '/api/v1/progress/dashboard',
  },
  learning: {
    savedWords: '/api/v1/learning/saved-words',
    savedWord: (wordId: number) => `/api/v1/learning/saved-words/${wordId}`,
    achievements: '/api/v1/learning/achievements',
    mockTests: '/api/v1/learning/mock-tests',
  },
} as const;

export type ApiEndpointGroup = keyof typeof API_ENDPOINTS;
