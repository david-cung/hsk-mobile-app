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
  learning_goal: string | null;
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
  meaning_en?: string;
  word_type?: string;
  category?: string;
  hsk_level?: number;
  strokes?: number;
  example_cn?: string;
  example_pinyin?: string;
  example_vi?: string;
  example_en?: string;
  usage_note?: string;
}

export interface GrammarPoint {
  title: string;
  structure?: string;
  explanation: string;
  examples: ChineseEntry[];
  common_mistakes?: string[];
}

export interface SentencePattern {
  pattern: string;
  meaning_vi?: string;
  examples?: string[];
}

export interface DialogueLine {
  speaker: string;
  chinese: string;
  pinyin?: string;
  vietnamese?: string;
}

export interface DialogueContent {
  title?: string;
  lines: DialogueLine[];
  vocabulary_list?: string[];
  grammar_list?: string[];
  cultural_note?: string;
}

export interface RichReadingContent {
  title?: string;
  chinese: string;
  pinyin?: string;
  vietnamese?: string;
  english?: string;
  questions?: Array<{
    question: string;
    answer: string;
    explanation?: string;
  }>;
}

export interface ListeningPracticeContent {
  script: string;
  pinyin?: string;
  vietnamese?: string;
  task?: string;
  answer?: string;
}

export interface PracticeExercise {
  id: string;
  title?: string;
  exercise_type:
    | 'multiple_choice'
    | 'text_input'
    | 'fill_blank'
    | 'rearrange'
    | string;
  skill?: string;
  prompt: string;
  options?: string[];
  correct_answer: string;
  expected_answer?: string;
  hint?: string;
  explanation?: string;
  word_bank?: string[];
}

export interface LessonContent {
  source_id?: string;
  focus?: string;
  hsk_level?: number;
  category?: string;
  learning_objectives?: string[];
  overview?: string;
  vocabulary?: ChineseEntry[];
  grammar_points?: GrammarPoint[];
  sentence_patterns?: SentencePattern[];
  dialogue?: DialogueContent | ChineseEntry;
  reading?: RichReadingContent;
  listening?: ListeningPracticeContent;
  speaking_tasks?: string[];
  reading_tasks?: string[];
  writing_tasks?: string[];
  passage_title?: string;
  passage?: ChineseEntry[];
  transcript?: ChineseEntry[];
  patterns?: ChineseEntry[];
  activities?: string[];
  review_items?: string[];
  items?: string[];
  translations?: {
    english?: string;
    vietnamese?: string;
  };
  cultural_note?: {
    english?: string;
    vietnamese?: string;
  };
  characters?: ChineseEntry[];
  practice_exercises?: PracticeExercise[];
  writing_exercises?: PracticeExercise[];
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

export interface QuestionResult {
  question_id: number;
  prompt?: string;
  correct: boolean;
  user_answer: string;
  correct_answer: string;
  explanation?: string | null;
}

export interface QuizSubmitResult {
  attempt_id: number;
  score: number;
  total_questions: number;
  correct_count: number;
  results: QuestionResult[];
}

export interface ProgressDashboard {
  current_hsk_level: number;
  target_hsk_level: number;
  daily_goal_minutes: number;
  minutes_studied_today: number;
  study_streak_days: number;
  lessons_completed: number;
  lessons_in_progress: number;
  total_lessons: number;
  current_level_total_lessons: number;
  current_level_completed_lessons: number;
  current_level_progress_percent: number;
  exam_readiness_percent: number;
  skill_breakdown: Array<{
    lesson_type: string;
    completed: number;
    total: number;
    average_score: number | null;
  }>;
  recent_attempts: Array<{
    attempt_id: number;
    lesson_id: number;
    lesson_title?: string | null;
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

export interface Mistake {
  attempt_id: number;
  lesson_id: number;
  lesson_title: string | null;
  question_id: number;
  prompt: string | null;
  user_answer: string;
  correct_answer: string;
  explanation?: string | null;
  finished_at: string;
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

export interface MockTestQuestion extends Question {
  lesson_id: number;
  lesson_title: string;
}
