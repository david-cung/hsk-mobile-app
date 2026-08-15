export interface User {
  id: number;
  email: string;
  display_name: string | null;
  is_admin: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
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

export type ProfileUpdate = Partial<
  Pick<
    Profile,
    | 'learning_goal'
    | 'target_hsk_level'
    | 'current_hsk_level'
    | 'daily_goal_minutes'
    | 'onboarding_completed'
  >
>;

export type LocalizedText = Partial<{
  en: string;
  vi: string;
  english: string;
  vietnamese: string;
}>;

export interface HskLevel {
  id: number;
  level_number: number;
  name?: string;
  title: string;
  title_translations?: LocalizedText;
  description: string | null;
  description_translations?: LocalizedText;
  total_characters: number;
  display_order?: number;
  status?: string;
  course_count?: number;
}

export interface Course {
  id: number;
  hsk_level_id: number;
  hsk_level: number;
  title: string;
  title_translations?: LocalizedText;
  description: string | null;
  description_translations?: LocalizedText;
  thumbnail_url: string | null;
  course_type: string;
  order: number;
  status: string;
  lesson_count: number;
}

export interface LessonListItem {
  id: number;
  hsk_level_id?: number;
  course_id?: number;
  title: string;
  title_translations?: LocalizedText;
  description: string | null;
  description_translations?: LocalizedText;
  lesson_type: string;
  sort_order: number;
  duration_minutes: number;
  status: string | null;
  score_percent: number | null;
  lesson_number?: number;
  difficulty?: number | null;
  content_status?: string;
}

export interface ChineseEntry {
  id?: number;
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
  id?: number;
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
  correct_answer?: string;
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
  course_id?: number;
  title: string;
  title_translations?: LocalizedText;
  description: string | null;
  description_translations?: LocalizedText;
  lesson_type: string;
  lesson_number?: number;
  duration_minutes: number;
  difficulty?: number | null;
  content_status?: string;
  listening_audio?: AudioAsset | null;
  content: LessonContent | null;
}

export interface AudioAsset {
  id: number;
  url: string | null;
  storage_provider: string;
  storage_key: string;
  duration_ms: number | null;
  format: string | null;
  locale: string | null;
}

export interface ExampleSentence {
  id: number;
  chinese: string;
  pinyin: string | null;
  translations: LocalizedText;
  audio: AudioAsset | null;
}

export interface VocabularyItem {
  id: number;
  simplified: string;
  traditional: string | null;
  pinyin: string | null;
  meaning_translations: LocalizedText;
  part_of_speech: string;
  hsk_level: number;
  difficulty: number | null;
  display_order: number;
  audio: AudioAsset | null;
  learning_status: 'new' | 'learning' | 'learned' | 'mastered';
  is_favorite: boolean;
}

export interface ContentLessonReference {
  id: number;
  course_id: number;
  title: string;
  lesson_number: number;
}

export interface VocabularyDetail extends VocabularyItem {
  hsk_level_id: number;
  category: string | null;
  examples: ExampleSentence[];
  lessons: ContentLessonReference[];
  status: string;
}

export interface VocabularyPage {
  items: VocabularyItem[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export interface GrammarDetail {
  id: number;
  title: string;
  title_translations?: LocalizedText;
  explanation_translations: LocalizedText;
  pattern: string | null;
  hsk_level: number;
  hsk_level_id: number;
  difficulty: number | null;
  display_order: number;
  learning_status: 'viewed' | 'completed' | null;
  examples: ExampleSentence[];
  lessons: ContentLessonReference[];
  status: string;
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

export type PracticeAnswer = string | string[] | Record<string, string>;

export interface PracticeOption {
  id: string;
  text: string;
  translations?: LocalizedText;
}

export interface PracticeConfiguration {
  options?: PracticeOption[];
  items?: PracticeOption[];
  targets?: PracticeOption[];
}

export interface PracticeQuestion {
  id: number;
  exercise_id: number;
  question_type:
    | 'multiple_choice'
    | 'multiple_select'
    | 'fill_blank'
    | 'matching'
    | 'ordering'
    | 'translation'
    | 'grammar'
    | 'reading'
    | 'dictation'
    | 'text_input'
    | 'vocabulary_recall'
    | string;
  prompt: string;
  prompt_translations?: LocalizedText;
  instruction?: string | null;
  explanation_available: boolean;
  difficulty?: number | null;
  points: number;
  order: number;
  configuration: PracticeConfiguration;
}

export interface PracticeSession {
  id: number;
  lesson_id: number;
  exercise_set_id: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  questions: PracticeQuestion[];
  total_questions: number;
  answered_questions: number;
  answered_question_ids: number[];
  correct_answers: number;
  score: number;
  time_spent_seconds: number;
  started_at: string;
  completed_at?: string | null;
}

export interface PracticeAnswerResult {
  attempt_id: number;
  question_id: number;
  correct: boolean;
  score: number;
  max_score: number;
  submitted_answer: PracticeAnswer;
  normalized_answer: PracticeAnswer;
  correct_answer: PracticeAnswer;
  explanation?: string | null;
  explanation_translations?: LocalizedText;
  answered_questions: number;
  correct_answers: number;
  session_score: number;
}

export interface PracticeReviewItem {
  question_id: number;
  prompt: string;
  prompt_translations?: LocalizedText;
  submitted_answer: PracticeAnswer;
  correct_answer: PracticeAnswer;
  correct: boolean;
  score: number;
  max_score: number;
  explanation?: string | null;
  explanation_translations?: LocalizedText;
}

export interface PracticeResults {
  session_id: number;
  status: string;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  score: number;
  accuracy: number;
  time_spent_seconds: number;
  review: PracticeReviewItem[];
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
