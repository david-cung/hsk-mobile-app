import { apiFetch } from './client';
import type {
  Achievement,
  AudioUrl,
  DailyActivity,
  ExamAttempt,
  ExamAttemptHistory,
  ExamDetail,
  ExamListItem,
  ExamResult,
  HskProgress,
  HskLevel,
  LessonDetail,
  LessonListItem,
  Mistake,
  MockTest,
  MockTestQuestion,
  PracticeAnswerResult,
  PracticeLesson,
  PracticeResults,
  PracticeSession,
  Profile,
  ProgressSummary,
  ProgressDashboard,
  ReviewCard,
  ReviewCardStatus,
  ReviewDue,
  ReviewRating,
  ReviewSummary,
  SkillPerformance,
  Question,
  QuizSubmitResult,
  SavedWord,
  SpeechRecording,
  SpeechUpload,
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

export const practiceApi = {
  lesson: (lessonId: number) => apiFetch<PracticeLesson>(`/api/v1/practice/lessons/${lessonId}`),
  createSession: (data: {
    lesson_id: number;
    exercise_set_id?: number | null;
    question_count?: number;
    difficulty?: number;
    skill?: string;
    resume?: boolean;
  }) =>
    apiFetch<PracticeSession>('/api/v1/practice/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  session: (sessionId: number) => apiFetch<PracticeSession>(`/api/v1/practice/sessions/${sessionId}`),
  submitAnswer: (
    sessionId: number,
    data: {
      question_id: number;
      answer: unknown;
      time_spent_seconds?: number;
      idempotency_key?: string;
      playback?: object;
    },
  ) =>
    apiFetch<PracticeAnswerResult>(`/api/v1/practice/sessions/${sessionId}/answers`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  complete: (sessionId: number) =>
    apiFetch<PracticeSession>(`/api/v1/practice/sessions/${sessionId}/complete`, { method: 'POST' }),
  results: (sessionId: number) => apiFetch<PracticeResults>(`/api/v1/practice/sessions/${sessionId}/results`),
};

export const audioApi = {
  url: (audioAssetId: number) => apiFetch<AudioUrl>(`/api/v1/audio/${audioAssetId}/url`),
};

export const speakingApi = {
  requestUpload: (data: {
    filename?: string | null;
    mime_type: string;
    size_bytes?: number | null;
    duration_seconds?: number | null;
    language?: string;
    metadata?: Record<string, unknown>;
  }) =>
    apiFetch<SpeechUpload>('/api/v1/speaking/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  completeUpload: (
    recordingId: number,
    data: {
      size_bytes?: number | null;
      duration_seconds?: number | null;
      metadata?: Record<string, unknown>;
    },
  ) =>
    apiFetch<SpeechRecording>(`/api/v1/speaking/upload/${recordingId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  recording: (recordingId: number) => apiFetch<SpeechRecording>(`/api/v1/speaking/recordings/${recordingId}`),
};

export const progressApi = {
  dashboard: () => apiFetch<ProgressDashboard>('/api/v1/progress/dashboard'),
  summary: () => apiFetch<ProgressSummary>('/api/v1/progress/summary'),
  hsk: (level: number) => apiFetch<HskProgress>(`/api/v1/progress/hsk/${level}`),
  skills: () => apiFetch<SkillPerformance[]>('/api/v1/progress/skills'),
  activity: (days = 30) => apiFetch<DailyActivity[]>(`/api/v1/progress/activity?days=${days}`),
};

export const reviewApi = {
  due: (limit?: number) => apiFetch<ReviewDue>(`/api/v1/review/due${limit ? `?limit=${limit}` : ''}`),
  summary: () => apiFetch<ReviewSummary>('/api/v1/review/summary'),
  cards: (cardType?: 'VOCABULARY' | 'GRAMMAR') =>
    apiFetch<ReviewCardStatus[]>(`/api/v1/review/cards${cardType ? `?card_type=${cardType}` : ''}`),
  enroll: (data: {
    card_type: 'VOCABULARY' | 'GRAMMAR';
    vocabulary_id?: number | null;
    grammar_id?: string | null;
    content_key?: string | null;
    content?: Record<string, unknown>;
  }) =>
    apiFetch<ReviewCard>('/api/v1/review/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submit: (cardId: number, data: { rating: ReviewRating; idempotency_key: string }) =>
    apiFetch<{ card: ReviewCard; reviewed_today: number; next_review_at?: string | null }>(
      `/api/v1/review/cards/${cardId}/review`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    ),
};

export const examApi = {
  list: (hskLevel?: number) => apiFetch<ExamListItem[]>(`/api/v1/exams${hskLevel ? `?hsk_level=${hskLevel}` : ''}`),
  detail: (examId: number) => apiFetch<ExamDetail>(`/api/v1/exams/${examId}`),
  start: (examId: number) => apiFetch<ExamAttempt>(`/api/v1/exams/${examId}/start`, { method: 'POST' }),
  attempt: (attemptId: number) => apiFetch<ExamAttempt>(`/api/v1/exam-attempts/${attemptId}`),
  history: (limit = 50, offset = 0) => apiFetch<ExamAttemptHistory[]>(`/api/v1/exam-attempts?limit=${limit}&offset=${offset}`),
  saveAnswer: (attemptId: number, questionId: number, answer: unknown, idempotencyKey?: string) =>
    apiFetch<ExamAttempt>(`/api/v1/exam-attempts/${attemptId}/answers/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify({ answer, idempotency_key: idempotencyKey }),
    }),
  submit: (attemptId: number) => apiFetch<ExamResult>(`/api/v1/exam-attempts/${attemptId}/submit`, { method: 'POST' }),
  result: (attemptId: number) => apiFetch<ExamResult>(`/api/v1/exam-attempts/${attemptId}/result`),
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
