import { apiFetch } from './client';
import type {
  AiConversation,
  AiConversationList,
  AiMessageAction,
  AiMessageResult,
  AiTutorMode,
  Achievement,
  GrammarExplainResult,
  RolePlayScenario,
  SentenceCheckResult,
  AudioUrl,
  Course,
  DailyActivity,
  DailyGoal,
  DailyGoalType,
  ExamAttempt,
  ExamAttemptHistory,
  ExamDetail,
  ExamListItem,
  ExamResult,
  GamificationProfile,
  GrammarDetail,
  HskLevel,
  HskProgress,
  LessonDetail,
  LessonListItem,
  Mistake,
  MockTest,
  MockTestQuestion,
  NotificationPreferences,
  PracticeAnswer,
  PracticeAnswerResult,
  PracticeLesson,
  PracticeResults,
  PracticeSession,
  Profile,
  ProfileUpdate,
  ProgressDashboard,
  ProgressSummary,
  Question,
  QuizSubmitResult,
  ReviewCard,
  ReviewCardStatus,
  ReviewDue,
  ReviewRating,
  ReviewSummary,
  SavedWord,
  SkillPerformance,
  SpeechRecording,
  SpeechUpload,
  TokenResponse,
  User,
  VocabularyDetail,
  VocabularyPage,
  WritingAiFeedback,
  XPHistory,
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
  lesson: (lessonId: number) =>
    apiFetch<PracticeLesson>(`/api/v1/practice/lessons/${lessonId}`),
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
  session: (sessionId: number) =>
    apiFetch<PracticeSession>(`/api/v1/practice/sessions/${sessionId}`),
  answer: (
    sessionId: number,
    data: {
      question_id: number;
      answer: PracticeAnswer;
      idempotency_key: string;
      time_spent_seconds: number;
      playback?: object;
    },
  ) =>
    apiFetch<PracticeAnswerResult>(`/api/v1/practice/sessions/${sessionId}/answers`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
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
    apiFetch<PracticeResults>(`/api/v1/practice/sessions/${sessionId}/complete`, {
      method: 'POST',
    }),
  results: (sessionId: number) =>
    apiFetch<PracticeResults>(`/api/v1/practice/sessions/${sessionId}/results`),
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
  recording: (recordingId: number) =>
    apiFetch<SpeechRecording>(`/api/v1/speaking/recordings/${recordingId}`),
};

export const progressApi = {
  dashboard: () => apiFetch<ProgressDashboard>('/api/v1/progress/dashboard'),
  summary: () => apiFetch<ProgressSummary>('/api/v1/progress/summary'),
  hsk: (level: number) => apiFetch<HskProgress>(`/api/v1/progress/hsk/${level}`),
  skills: () => apiFetch<SkillPerformance[]>('/api/v1/progress/skills'),
  activity: (days = 30) =>
    apiFetch<DailyActivity[]>(`/api/v1/progress/activity?days=${days}`),
  startLesson: (lessonId: number) =>
    apiFetch(`/api/v1/lessons/${lessonId}/start`, { method: 'POST' }),
  completeLesson: (lessonId: number) =>
    apiFetch(`/api/v1/lessons/${lessonId}/complete`, { method: 'POST' }),
};

export const reviewApi = {
  due: (limit?: number) =>
    apiFetch<ReviewDue>(`/api/v1/review/due${limit ? `?limit=${limit}` : ''}`),
  summary: () => apiFetch<ReviewSummary>('/api/v1/review/summary'),
  cards: (cardType?: 'VOCABULARY' | 'GRAMMAR') =>
    apiFetch<ReviewCardStatus[]>(
      `/api/v1/review/cards${cardType ? `?card_type=${cardType}` : ''}`,
    ),
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
  list: (hskLevel?: number) =>
    apiFetch<ExamListItem[]>(`/api/v1/exams${hskLevel ? `?hsk_level=${hskLevel}` : ''}`),
  detail: (examId: number) => apiFetch<ExamDetail>(`/api/v1/exams/${examId}`),
  start: (examId: number) =>
    apiFetch<ExamAttempt>(`/api/v1/exams/${examId}/start`, { method: 'POST' }),
  attempt: (attemptId: number) =>
    apiFetch<ExamAttempt>(`/api/v1/exam-attempts/${attemptId}`),
  history: (limit = 50, offset = 0) =>
    apiFetch<ExamAttemptHistory[]>(`/api/v1/exam-attempts?limit=${limit}&offset=${offset}`),
  saveAnswer: (
    attemptId: number,
    questionId: number,
    answer: unknown,
    idempotencyKey?: string,
  ) =>
    apiFetch<ExamAttempt>(`/api/v1/exam-attempts/${attemptId}/answers/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify({ answer, idempotency_key: idempotencyKey }),
    }),
  submit: (attemptId: number) =>
    apiFetch<ExamResult>(`/api/v1/exam-attempts/${attemptId}/submit`, { method: 'POST' }),
  result: (attemptId: number) =>
    apiFetch<ExamResult>(`/api/v1/exam-attempts/${attemptId}/result`),
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
  achievements: () => apiFetch<Achievement[]>('/api/v1/gamification/achievements'),
  mockTests: () => apiFetch<MockTest[]>('/api/v1/learning/mock-tests', { auth: false }),
  mockTestQuestions: (id: number) =>
    apiFetch<MockTestQuestion[]>(`/api/v1/learning/mock-tests/${id}/questions`),
  submitMockTest: (id: number, answers: Record<string, string>) =>
    apiFetch<QuizSubmitResult>(`/api/v1/learning/mock-tests/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
};

export const gamificationApi = {
  profile: () => apiFetch<GamificationProfile>('/api/v1/gamification/profile'),
  achievements: () => apiFetch<Achievement[]>('/api/v1/gamification/achievements'),
  history: (limit = 20, offset = 0) =>
    apiFetch<XPHistory>(`/api/v1/gamification/history?limit=${limit}&offset=${offset}`),
  daily: () => apiFetch<DailyGoal>('/api/v1/gamification/daily'),
  updateDaily: (data: { goal_type?: DailyGoalType; target?: number }) =>
    apiFetch<DailyGoal>('/api/v1/gamification/daily', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const notificationApi = {
  preferences: () => apiFetch<NotificationPreferences>('/api/v1/notifications/preferences'),
  updatePreferences: (data: Partial<NotificationPreferences>) =>
    apiFetch<NotificationPreferences>('/api/v1/notifications/preferences', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  registerDevice: (data: { token: string; platform: 'ios' | 'android' | 'web' | 'local' }) =>
    apiFetch<{ id: number; token: string; platform: string; active: boolean }>(
      '/api/v1/notifications/devices',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    ),
  unregisterDevice: (token: string) =>
    apiFetch<void>(`/api/v1/notifications/devices/${encodeURIComponent(token)}`, {
      method: 'DELETE',
    }),
};

export const tutorApi = {
  scenarios: () => apiFetch<RolePlayScenario[]>('/api/v1/ai/scenarios'),
  list: (limit = 20, offset = 0) =>
    apiFetch<AiConversationList>(`/api/v1/ai/conversations?limit=${limit}&offset=${offset}`),
  create: (data: {
    mode: AiTutorMode;
    lesson_id?: number;
    course_id?: number;
    hsk_level?: number;
    scenario_id?: string;
    explanation_language?: string;
    title?: string;
  }) =>
    apiFetch<AiConversation>('/api/v1/ai/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  detail: (id: number) => apiFetch<AiConversation>(`/api/v1/ai/conversations/${id}`),
  remove: (id: number) => apiFetch<void>(`/api/v1/ai/conversations/${id}`, { method: 'DELETE' }),
  sendMessage: (
    id: number,
    data: { content: string; action?: AiMessageAction; idempotency_key?: string },
  ) =>
    apiFetch<AiMessageResult>(`/api/v1/ai/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  checkSentence: (sentence: string, lessonId?: number) =>
    apiFetch<SentenceCheckResult>('/api/v1/ai/sentence-check', {
      method: 'POST',
      body: JSON.stringify({ sentence, lesson_id: lessonId }),
    }),
  explainGrammar: (grammarPoint: string, sentence?: string, lessonId?: number) =>
    apiFetch<GrammarExplainResult>('/api/v1/ai/grammar-explain', {
      method: 'POST',
      body: JSON.stringify({ grammar_point: grammarPoint, sentence, lesson_id: lessonId }),
    }),
  writingFeedback: (answer: string, prompt?: string, lessonId?: number) =>
    apiFetch<WritingAiFeedback>('/api/v1/ai/writing-feedback', {
      method: 'POST',
      body: JSON.stringify({ answer, prompt, lesson_id: lessonId }),
    }),
};
