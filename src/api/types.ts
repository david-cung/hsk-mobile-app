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

export type LocalizedText = Partial<{
  en: string;
  vi: string;
  english: string;
  vietnamese: string;
}>;

export interface HskLevel {
  id: number;
  level_number: number;
  title: string;
  title_translations?: LocalizedText;
  description: string | null;
  description_translations?: LocalizedText;
  total_characters: number;
}

export interface LessonListItem {
  id: number;
  title: string;
  title_translations?: LocalizedText;
  description: string | null;
  description_translations?: LocalizedText;
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
  meaning_vi?: string;
  meaning_en?: string;
  translations?: LocalizedText;
  word_type?: string;
  category?: string;
  category_translations?: LocalizedText;
  hsk_level?: number;
  strokes?: number;
  example_cn?: string;
  example_pinyin?: string;
  example_vi?: string;
  example_en?: string;
  example_translations?: LocalizedText;
  usage_note?: string;
  usage_note_translations?: LocalizedText;
}

export interface GrammarPoint {
  title: string;
  title_translations?: LocalizedText;
  structure?: string;
  explanation: string;
  explanation_translations?: LocalizedText;
  examples: ChineseEntry[];
  common_mistakes?: string[];
  common_mistakes_translations?: Partial<Record<'en' | 'vi', string[]>>;
}

export interface SentencePattern {
  pattern: string;
  meaning_vi?: string;
  meaning_en?: string;
  translations?: LocalizedText;
  examples?: string[];
}

export interface DialogueLine {
  speaker: string;
  chinese: string;
  pinyin?: string;
  vietnamese?: string;
  english?: string;
  translations?: LocalizedText;
}

export interface DialogueContent {
  title?: string;
  title_translations?: LocalizedText;
  lines: DialogueLine[];
  vocabulary_list?: string[];
  grammar_list?: string[];
  cultural_note?: string;
  cultural_note_translations?: LocalizedText;
}

export interface RichReadingContent {
  title?: string;
  title_translations?: LocalizedText;
  chinese: string;
  pinyin?: string;
  vietnamese?: string;
  english?: string;
  translations?: LocalizedText;
  questions?: Array<{
    question: string;
    question_translations?: LocalizedText;
    answer: string;
    answer_translations?: LocalizedText;
    explanation?: string;
    explanation_translations?: LocalizedText;
  }>;
}

export interface ListeningPracticeContent {
  script: string;
  pinyin?: string;
  vietnamese?: string;
  english?: string;
  translations?: LocalizedText;
  task?: string;
  task_translations?: LocalizedText;
  answer?: string;
  answer_translations?: LocalizedText;
}

export interface PracticeExercise {
  id: string;
  title?: string;
  title_translations?: LocalizedText;
  exercise_type:
    | 'multiple_choice'
    | 'text_input'
    | 'fill_blank'
    | 'rearrange'
    | string;
  skill?: string;
  prompt: string;
  prompt_translations?: LocalizedText;
  options?: string[];
  options_translations?: Partial<Record<'en' | 'vi', string[]>>;
  correct_answer: string;
  expected_answer?: string;
  hint?: string;
  hint_translations?: LocalizedText;
  explanation?: string;
  explanation_translations?: LocalizedText;
  word_bank?: string[];
}

export interface LessonContent {
  source_id?: string;
  focus?: string;
  hsk_level?: number;
  category?: string;
  learning_objectives?: string[];
  learning_objective_translations?: Partial<Record<'en' | 'vi', string[]>>;
  overview?: string;
  overview_translations?: LocalizedText;
  vocabulary?: ChineseEntry[];
  grammar_points?: GrammarPoint[];
  sentence_patterns?: SentencePattern[];
  dialogue?: DialogueContent | ChineseEntry;
  reading?: RichReadingContent;
  listening?: ListeningPracticeContent;
  speaking_tasks?: string[];
  speaking_task_translations?: Partial<Record<'en' | 'vi', string[]>>;
  reading_tasks?: string[];
  reading_task_translations?: Partial<Record<'en' | 'vi', string[]>>;
  writing_tasks?: string[];
  writing_task_translations?: Partial<Record<'en' | 'vi', string[]>>;
  passage_title?: string;
  passage_title_translations?: LocalizedText;
  passage?: ChineseEntry[];
  transcript?: ChineseEntry[];
  patterns?: ChineseEntry[];
  activities?: string[];
  activity_translations?: Partial<Record<'en' | 'vi', string[]>>;
  review_items?: string[];
  review_item_translations?: Partial<Record<'en' | 'vi', string[]>>;
  items?: string[];
  item_translations?: Partial<Record<'en' | 'vi', string[]>>;
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
  tip_translations?: LocalizedText;
}

export interface LessonDetail {
  id: number;
  hsk_level_id: number;
  title: string;
  title_translations?: LocalizedText;
  description: string | null;
  description_translations?: LocalizedText;
  lesson_type: string;
  duration_minutes: number;
  content: LessonContent | null;
}

export interface Question {
  id: number;
  question_type: string;
  prompt: string;
  prompt_translations?: LocalizedText;
  options: string[] | null;
  options_translations?: Partial<Record<'en' | 'vi', string[]>>;
  sort_order: number;
}

export interface QuestionResult {
  question_id: number;
  prompt?: string;
  prompt_translations?: LocalizedText;
  correct: boolean;
  user_answer: string;
  correct_answer: string;
  explanation?: string | null;
  explanation_translations?: LocalizedText;
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
    lesson_title_translations?: LocalizedText;
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
  lesson_title_translations?: LocalizedText;
  question_id: number;
  prompt: string | null;
  prompt_translations?: LocalizedText;
  user_answer: string;
  correct_answer: string;
  explanation?: string | null;
  explanation_translations?: LocalizedText;
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
  title_translations?: LocalizedText;
  hsk_level: number;
  duration_minutes: number;
  question_count: number;
}

export interface MockTestQuestion extends Question {
  lesson_id: number;
  lesson_title: string;
  lesson_title_translations?: LocalizedText;
}
