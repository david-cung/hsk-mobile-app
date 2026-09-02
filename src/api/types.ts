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
  longest_streak_days?: number;
  last_active_date?: string | null;
  timezone?: string;
  daily_new_cards_limit?: number;
  daily_review_cards_limit?: number;
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
  overall_progress_percent?: number;
  today_questions?: number;
  today_accuracy?: number | null;
  longest_streak_days?: number;
  last_active_date?: string | null;
  cards_due?: number;
  cards_overdue?: number;
  cards_reviewed_today?: number;
  review_retention?: number | null;
  review_streak_days?: number;
  exams_attempted?: number;
  exams_completed?: number;
  exam_best_score?: number | null;
  exam_latest_score?: number | null;
  exam_average_score?: number | null;
  exam_section_performance?: Array<Record<string, unknown>>;
  writing_exercises_attempted?: number;
  writing_exercises_completed?: number;
  writing_accuracy?: number | null;
  writing_average_score?: number | null;
  guided_writing_count?: number;
  translation_accuracy?: number | null;
  word_order_accuracy?: number | null;
  recommended_practice?: Recommendation[];
  weak_areas?: WeakArea[];
  skill_overview?: SkillPerformance[];
}

export interface ProgressMetric {
  total: number;
  completed: number;
  percent: number | null;
}

export interface AccuracyMetric {
  attempts: number;
  correct: number;
  accuracy: number | null;
  average_score?: number | null;
}

export interface SkillPerformance {
  skill: string;
  attempts: number;
  correct: number;
  accuracy: number | null;
  average_score?: number | null;
  study_minutes: number;
  practiced: boolean;
  trend?: 'improving' | 'stable' | 'declining' | string | null;
  trend_delta?: number | null;
}

export interface WeakArea {
  type: string;
  label: string;
  skill?: string | null;
  target_id?: number | string | null;
  metric?: number | null;
  attempts: number;
  reason: string;
}

export interface Recommendation {
  type: string;
  target_id?: number | string | null;
  target_label?: string | null;
  reason: string;
  activity_type: string;
}

export interface ContinueLearning {
  lesson_id?: number | null;
  lesson_title?: string | null;
  lesson_title_translations?: LocalizedText;
  hsk_level?: number | null;
  lesson_type?: string | null;
}

export interface DailyActivity {
  date: string;
  study_minutes: number;
  practice_attempts: number;
  questions: number;
  correct: number;
  accuracy: number | null;
  lessons_studied: number;
  vocabulary_practiced: number;
  grammar_practiced: number;
  listening_practiced: number;
  speaking_practiced: number;
  writing_practiced: number;
}

export interface ProgressSummary {
  current_hsk_level: number;
  target_hsk_level: number;
  overall_progress_percent: number;
  today_study_minutes: number;
  today_questions: number;
  today_accuracy: number | null;
  current_streak_days: number;
  longest_streak_days: number;
  last_active_date?: string | null;
  cards_due: number;
  cards_overdue: number;
  cards_reviewed_today: number;
  review_retention?: number | null;
  review_streak_days: number;
  exams_attempted: number;
  exams_completed: number;
  exam_best_score?: number | null;
  exam_latest_score?: number | null;
  exam_average_score?: number | null;
  exam_section_performance: Array<Record<string, unknown>>;
  writing_exercises_attempted: number;
  writing_exercises_completed: number;
  writing_accuracy?: number | null;
  writing_average_score?: number | null;
  guided_writing_count: number;
  translation_accuracy?: number | null;
  word_order_accuracy?: number | null;
  weak_skills: WeakArea[];
  recommended_practice: Recommendation[];
  continue_learning?: ContinueLearning | null;
  skill_overview: SkillPerformance[];
}

export interface HskProgress {
  level: number;
  level_id: number;
  title: string;
  title_translations?: LocalizedText;
  vocabulary: ProgressMetric;
  grammar: ProgressMetric;
  lessons: ProgressMetric;
  practice: AccuracyMetric;
  listening?: AccuracyMetric | null;
  speaking?: AccuracyMetric | null;
  skill_performance: SkillPerformance[];
  study_minutes: number;
}

export interface SavedWord {
  id: number;
  hanzi: string;
  pinyin: string | null;
  meaning: string | null;
  hsk_level: number | null;
  saved_at: string;
}

export type ReviewRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface ReviewRatingPreview {
  rating: ReviewRating;
  due_at: string;
  interval_days: number;
  interval_label: string;
}

export interface ReviewCard {
  id: number;
  card_type: 'VOCABULARY' | 'GRAMMAR' | string;
  state: string;
  due_at: string;
  last_reviewed_at?: string | null;
  overdue_seconds: number;
  content: Record<string, unknown>;
  rating_previews: ReviewRatingPreview[];
}

export interface ReviewDue {
  items: ReviewCard[];
  due_count: number;
  overdue_count: number;
  new_count: number;
  review_limit: number;
  new_limit: number;
  next_review_at?: string | null;
}

export interface ReviewSummary {
  due_count: number;
  overdue_count: number;
  new_count: number;
  reviewed_today: number;
  retention?: number | null;
  review_streak_days: number;
  next_review_at?: string | null;
}

export interface ReviewCardStatus {
  id: number;
  card_type: string;
  vocabulary_id?: number | null;
  grammar_id?: string | null;
  content_key: string;
  state: string;
  due_at: string;
  last_reviewed_at?: string | null;
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
  description?: string | null;
  hsk_level: number;
  exam_type?: string;
  duration_minutes: number;
  question_count: number;
  sections?: ExamSection[];
  attempt_count?: number;
  best_percentage?: number | null;
  status?: string;
}

export interface MockTestQuestion extends Question {
  lesson_id: number;
  lesson_title: string;
  lesson_title_translations?: LocalizedText;
}

export interface ExamSection {
  type: string;
  title: string;
  duration_minutes: number;
  question_count: number;
  allow_previous?: boolean;
}

export interface ExamListItem {
  id: number;
  title: string;
  title_translations?: LocalizedText;
  description?: string | null;
  hsk_level: number;
  exam_type: string;
  duration_minutes: number;
  question_count: number;
  sections: ExamSection[];
  attempt_count: number;
  best_percentage?: number | null;
  status: string;
}

export interface ExamDetail extends ExamListItem {
  instructions?: string | null;
  availability: string;
  latest_attempt_id?: number | null;
}

export interface ExamQuestion extends PracticeQuestion {
  section: string;
  section_index: number;
  question_index: number;
  lesson_title?: string | null;
  lesson_title_translations?: LocalizedText;
}

export interface ExamAttempt {
  attempt_id: number;
  exam_id: number;
  exam_version: number;
  status: string;
  title: string;
  title_translations?: LocalizedText;
  hsk_level: number;
  duration_minutes: number;
  sections: ExamSection[];
  questions: ExamQuestion[];
  answers: Record<string, unknown>;
  server_time: string;
  started_at: string;
  expires_at: string;
  submitted_at?: string | null;
  remaining_seconds: number;
  current_section?: string | null;
  allow_previous_section: boolean;
}

export interface ExamAttemptHistory {
  attempt_id: number;
  exam_id: number;
  title: string;
  hsk_level: number;
  status: string;
  score?: number | null;
  percentage?: number | null;
  passed?: boolean | null;
  started_at: string;
  submitted_at?: string | null;
}

export interface ExamSectionResult {
  section: string;
  total_questions: number;
  answered: number;
  correct: number;
  incorrect: number;
  skipped: number;
  raw_score: number;
  percentage: number;
  time_used_seconds: number;
}

export interface ExamQuestionResult {
  question_id: number;
  section: string;
  prompt?: string | null;
  user_answer?: unknown;
  correct_answer?: unknown;
  correct?: boolean | null;
  points: number;
  max_points: number;
  explanation?: string | null;
  evaluation_source?: string | null;
  writing_evaluation?: WritingEvaluation | null;
}

export interface ExamResult {
  attempt_id: number;
  exam_id: number;
  title: string;
  hsk_level: number;
  status: string;
  score_label: string;
  raw_score: number;
  total_points: number;
  percentage: number;
  passed?: boolean | null;
  started_at: string;
  submitted_at?: string | null;
  expires_at: string;
  time_used_seconds: number;
  sections: ExamSectionResult[];
  questions: ExamQuestionResult[];
  weak_areas: WeakArea[];
  recommended_practice: Recommendation[];
}

export type PracticeQuestionType =
  | 'MULTIPLE_CHOICE'
  | 'MULTIPLE_SELECT'
  | 'FILL_BLANK'
  | 'MATCHING'
  | 'ORDERING'
  | 'TRANSLATION'
  | 'GRAMMAR'
  | 'READING'
  | 'LISTENING'
  | 'SPEAKING'
  | 'PRONUNCIATION'
  | 'DICTATION'
  | 'WORD_ORDER'
  | 'SENTENCE_REORDER'
  | 'TRANSLATION_TO_CHINESE'
  | 'GUIDED_WRITING'
  | 'TEXT_INPUT'
  | string;

export interface PracticeQuestion {
  id: number;
  exercise_id: number | null;
  question_type: PracticeQuestionType;
  prompt: string;
  instruction?: string | null;
  explanation?: string | null;
  difficulty: number;
  points: number;
  order: number;
  config: {
    options?: Array<{ id: string; text: string }>;
    items?: Array<{ id: string; text: string }>;
    tokens?: Array<{ id: string; text: string }>;
    left?: Array<{ id: string; text: string }>;
    right?: Array<{ id: string; text: string }>;
    word_bank?: string[];
    placeholder?: string;
    required_vocabulary?: string[];
    required_grammar?: string[];
    required_keywords?: string[];
    min_characters?: number;
    max_characters?: number;
    min_chinese_ratio?: number;
    [key: string]: unknown;
  };
}

export interface WritingCriterion {
  key: string;
  passed: boolean;
  score: number;
  actual?: unknown;
  expected?: unknown;
  missing?: unknown[];
}

export interface WritingEvaluation {
  kind: string;
  label?: string;
  criteria?: WritingCriterion[];
  matched_tokens?: unknown;
  missing_tokens?: unknown[];
  character_count?: number;
  chinese_character_ratio?: number;
}

export interface PracticeLesson {
  lesson_id: number;
  exercise_set_id: number | null;
  title: string;
  total_questions: number;
  questions: PracticeQuestion[];
}

export interface PracticeSession {
  id: number;
  lesson_id: number | null;
  exercise_set_id: number | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | string;
  started_at: string;
  completed_at: string | null;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  score: number;
  time_spent_seconds: number;
  questions: PracticeQuestion[];
}

export interface PracticeAnswerResult {
  attempt_id: number;
  question_id: number;
  correct: boolean;
  score: number;
  max_score: number;
  correct_answer: unknown;
  explanation?: string | null;
  normalized_answer: Record<string, unknown>;
  transcript?: string | null;
  pinyin?: string | null;
  translation?: string | null;
  processing_status?: string | null;
  speech_analysis?: SpeechAnalysis | null;
  writing_evaluation?: WritingEvaluation | null;
  session: PracticeSession;
}

export interface PracticeReviewItem {
  question: PracticeQuestion;
  user_answer: unknown;
  correct_answer: unknown;
  correct: boolean;
  score: number;
  explanation?: string | null;
  transcript?: string | null;
  pinyin?: string | null;
  translation?: string | null;
  processing_status?: string | null;
  speech_analysis?: SpeechAnalysis | null;
  writing_evaluation?: WritingEvaluation | null;
  attempted_at?: string | null;
}

export interface PracticeResults {
  session_id: number;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  score: number;
  accuracy: number;
  time_spent_seconds: number;
  review: PracticeReviewItem[];
}

export interface AudioUrl {
  audio_asset_id: number;
  url: string;
  provider: string;
  mime_type: string;
  expires_at: string;
}

export interface SpeechWordFeedback {
  expected: string;
  recognized?: string | null;
  pronunciation_score?: number | null;
  accuracy_score?: number | null;
  expected_pinyin?: string | null;
  recognized_pinyin?: string | null;
  tone_score?: number | null;
}

export interface SpeechAnalysis {
  recognized_text?: string | null;
  confidence?: number | null;
  pronunciation_score?: number | null;
  accuracy_score?: number | null;
  fluency_score?: number | null;
  completeness_score?: number | null;
  words: SpeechWordFeedback[];
  feedback_label?: string | null;
  provider?: string | null;
  provider_model_version?: string | null;
  tone_feedback?: Record<string, unknown> | null;
}

export interface SpeechUpload {
  recording_id: number;
  storage_key: string;
  upload_url: string;
  headers: Record<string, string>;
  expires_at: string;
  max_size_bytes: number;
  status: string;
}

export interface SpeechRecording {
  id: number;
  storage_key: string;
  mime_type: string;
  size_bytes?: number | null;
  duration_seconds?: number | null;
  language: string;
  status: string;
  upload_expires_at: string;
  uploaded_at?: string | null;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
