export interface User {
  id: number;
  email: string;
  display_name: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Profile {
  target_hsk_level: number;
  current_hsk_level: number;
  daily_goal_minutes: number;
  study_streak_days: number;
  onboarding_completed: boolean;
}

export interface HskLevel {
  id: number;
  level_number: number;
  title: string;
  description: string | null;
  total_characters: number;
}

export interface LessonListItem {
  id: number;
  title: string;
  description: string | null;
  lesson_type: string;
  sort_order: number;
  duration_minutes: number;
  status: string | null;
  score_percent: number | null;
}

export interface ChineseEntry {
  hanzi: string;
  pinyin?: string;
  meaning?: string;
  strokes?: number;
}

export interface GrammarPoint {
  title: string;
  explanation: string;
  examples: ChineseEntry[];
}

export interface LessonContent {
  vocabulary?: ChineseEntry[];
  grammar_points?: GrammarPoint[];
  passage_title?: string;
  passage?: ChineseEntry[];
  transcript?: ChineseEntry[];
  characters?: ChineseEntry[];
  tip?: string;
}

export interface LessonDetail {
  id: number;
  hsk_level_id: number;
  title: string;
  description: string | null;
  lesson_type: string;
  duration_minutes: number;
  content: LessonContent | null;
}

export interface Question {
  id: number;
  question_type: string;
  prompt: string;
  options: string[] | null;
  sort_order: number;
}

export interface QuizSubmitResult {
  attempt_id: number;
  score: number;
  total_questions: number;
  correct_count: number;
  results: Array<{
    question_id: number;
    correct: boolean;
    user_answer: string;
    correct_answer: string;
    explanation?: string;
  }>;
}

export interface ProgressDashboard {
  current_hsk_level: number;
  target_hsk_level: number;
  daily_goal_minutes: number;
  minutes_studied_today: number;
  study_streak_days: number;
  lessons_completed: number;
  lessons_in_progress: number;
  recent_attempts: Array<{
    attempt_id: number;
    lesson_id: number;
    score: number;
    finished_at: string;
  }>;
}

export interface SavedWord {
  id: number;
  hanzi: string;
  pinyin: string | null;
  meaning: string | null;
  hsk_level: number | null;
  saved_at: string;
}

export interface Achievement {
  id: number;
  code: string;
  title: string;
  description: string | null;
  icon: string | null;
  earned: boolean;
  earned_at: string | null;
}

export interface MockTest {
  id: number;
  title: string;
  hsk_level: number;
  duration_minutes: number;
  question_count: number;
}
