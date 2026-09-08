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
  daily_goal_type: DailyGoalType;
  study_streak_days: number;
  onboarding_completed: boolean;
  timezone: string;
  target_exam_revision_id?: number | null;
  target_exam_level_id?: number | null;
}

export type ProfileUpdate = Partial<
  Pick<
    Profile,
    | 'learning_goal'
    | 'target_hsk_level'
    | 'current_hsk_level'
    | 'daily_goal_minutes'
    | 'daily_goal_type'
    | 'onboarding_completed'
    | 'timezone'
    | 'target_exam_revision_id'
    | 'target_exam_level_id'
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

export interface ExamStandard {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  status: string;
}

export interface ExamSpecification {
  id: number;
  standard_id: number;
  standard_code: string;
  code: string;
  name: string;
  description?: string | null;
  status: string;
}

export interface ExamRevision {
  id: number;
  specification_id: number;
  specification_code: string;
  code: string;
  version: string;
  name: string;
  description?: string | null;
  status: string;
  is_default: boolean;
}

export interface ExamLevel {
  id: number;
  revision_id: number;
  revision_code: string;
  code: string;
  level_number?: number | null;
  display_name: string;
  description?: string | null;
  sort_order: number;
  status: string;
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

export interface SpeakingAnswer {
  recording_id?: number;
  recording_uri?: string;
  duration_seconds?: number;
}

export type PracticeAnswer =
  | string
  | string[]
  | Record<string, string>
  | Array<{ left: string; right: string }>
  | SpeakingAnswer;

export interface PracticeOption {
  id: string;
  text: string;
  translations?: LocalizedText;
}

export interface PracticeConfiguration {
  options?: PracticeOption[];
  items?: PracticeOption[];
  targets?: PracticeOption[];
  tokens?: PracticeOption[];
  left?: PracticeOption[];
  right?: PracticeOption[];
  word_bank?: string[];
  placeholder?: string;
  required_vocabulary?: string[];
  required_grammar?: string[];
  required_keywords?: string[];
  min_characters?: number;
  max_characters?: number;
  min_chinese_ratio?: number;
  audio_asset_id?: number;
  answer_type?: string;
  auto_play?: boolean;
  allow_seek?: boolean;
  replay_limit?: number;
  display_text?: string;
  expected_text?: string;
  pinyin?: string;
  translation?: string;
  recording?: { preferred_mime_type?: string };
  [key: string]: unknown;
}

export interface PracticeQuestion {
  id: number;
  question_version_id?: number | null;
  exercise_id: number | null;
  question_type: string;
  prompt: string;
  prompt_translations?: LocalizedText;
  instruction?: string | null;
  explanation?: string | null;
  explanation_available?: boolean;
  difficulty?: number | null;
  points: number;
  order: number;
  configuration?: PracticeConfiguration;
  /** Exam API alias for configuration. */
  config?: PracticeConfiguration;
}

export function questionConfig(question: {
  configuration?: PracticeConfiguration;
  config?: PracticeConfiguration;
}): PracticeConfiguration {
  return question.configuration ?? question.config ?? {};
}

export function canonicalQuestionType(value: string | undefined): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/-/g, '_');
}

export interface PracticeSession {
  id: number;
  lesson_id: number;
  exercise_set_id: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  questions: PracticeQuestion[];
  total_questions: number;
  answered_questions: number;
    answered_question_ids?: number[];
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
  submitted_answer?: PracticeAnswer;
  normalized_answer?: PracticeAnswer | Record<string, unknown>;
  correct_answer: PracticeAnswer | unknown;
  explanation?: string | null;
  explanation_translations?: LocalizedText;
  answered_questions?: number;
  correct_answers?: number;
  session_score?: number;
  transcript?: string | null;
  pinyin?: string | null;
  translation?: string | null;
  processing_status?: string | null;
  speech_analysis?: SpeechAnalysis | null;
  writing_evaluation?: WritingEvaluation | null;
  session?: PracticeSession;
}

export interface PracticeReviewItem {
  question_id?: number;
  prompt?: string;
  prompt_translations?: LocalizedText;
  question?: PracticeQuestion;
  submitted_answer?: PracticeAnswer;
  user_answer?: unknown;
  correct_answer: PracticeAnswer | unknown;
  correct: boolean;
  score: number;
  max_score?: number;
  explanation?: string | null;
  explanation_translations?: LocalizedText;
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
  progress?: {
    current: number;
    target: number;
  } | null;
}

export type DailyGoalType = 'minutes' | 'exercises' | 'xp' | 'lessons';

export interface GamificationProfile {
  xp: number;
  level: number;
  xp_into_level: number;
  xp_to_next_level: number;
  level_xp_required: number;
  progress_percent: number;
  streak_days: number;
  longest_streak_days: number;
  timezone: string;
  daily_goal_type: DailyGoalType;
  daily_goal_target: number;
  daily_goal_current: number;
  daily_goal_completed: boolean;
  today_xp: number;
  today_minutes: number;
  today_exercises: number;
  today_lessons: number;
  today_reviews: number;
  today: string;
}

export interface XPHistoryItem {
  id: number;
  event_type: string;
  source_id: string;
  xp: number;
  created_at: string;
}

export interface XPHistory {
  items: XPHistoryItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface DailyGoal {
  date: string;
  timezone: string;
  xp: number;
  minutes: number;
  exercises: number;
  lessons: number;
  reviews: number;
  goal_type: DailyGoalType;
  goal_target: number;
  goal_current: number;
  goal_completed: boolean;
  streak_days: number;
}

export interface NotificationPreferences {
  daily_reminder: boolean;
  streak_reminder: boolean;
  srs_reminder: boolean;
  exam_reminder: boolean;
  achievement_notification: boolean;
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
  ai_conversations?: number;
  ai_messages?: number;
  ai_corrections?: number;
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

export interface ExamSection {
  type: string;
  title: string;
  duration_minutes: number;
  question_count: number;
  allow_previous?: boolean;
  code?: string | null;
  skill?: string | null;
  duration_seconds?: number | null;
  instructions?: string | null;
  parts?: Array<{ id?: number | null; code?: string | null; title: string; sort_order?: number }>;
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
  exam_revision_id?: number | null;
  exam_level_id?: number | null;
  scoring_policy_id?: number | null;
  blueprint_schema_version?: number;
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
  part_id?: number | null;
  part_code?: string | null;
  part_title?: string | null;
  lesson_title?: string | null;
  lesson_title_translations?: LocalizedText;
}

export interface ExamAttempt {
  attempt_id: number;
  exam_id: number;
  exam_version: number;
  exam_version_id?: number | null;
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
  exam_revision_id?: number | null;
  exam_level_id?: number | null;
  scoring_policy_id?: number | null;
  blueprint_schema_version?: number;
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
  question_version_id?: number | null;
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

export type AiTutorMode =
  | 'FREE_CHAT'
  | 'LESSON_PRACTICE'
  | 'ROLE_PLAY'
  | 'GRAMMAR_PRACTICE'
  | 'VOCABULARY_PRACTICE';

export type AiMessageAction = 'reply' | 'explain' | 'correct' | 'pinyin' | 'translate';

export interface RolePlayScenario {
  id: string;
  title: string;
  title_translations?: LocalizedText;
  description?: string | null;
  description_translations?: LocalizedText;
}

export interface AiTutorMessage {
  id: number;
  role: 'USER' | 'ASSISTANT';
  content: string;
  chinese_text?: string | null;
  pinyin?: string | null;
  translation?: string | null;
  corrections: Array<Record<string, unknown>>;
  vocabulary_notes: Array<Record<string, unknown>>;
  grammar_notes: Array<Record<string, unknown>>;
  prompt_version?: string | null;
  created_at: string;
}

export interface AiConversation {
  id: number;
  mode: AiTutorMode;
  hsk_level: number;
  course_id?: number | null;
  lesson_id?: number | null;
  title: string;
  scenario_id?: string | null;
  explanation_language: string;
  created_at: string;
  updated_at: string;
  messages: AiTutorMessage[];
}

export interface AiConversationList {
  items: AiConversation[];
  total: number;
  limit: number;
  offset: number;
}

export interface AiMessageResult {
  conversation: AiConversation;
  user_message: AiTutorMessage;
  assistant_message: AiTutorMessage;
}

export interface SentenceCheckResult {
  corrected_sentence: string;
  is_correct: boolean;
  explanation: string;
  alternatives: string[];
  vocabulary_notes: Array<Record<string, unknown>>;
  grammar_notes: Array<Record<string, unknown>>;
}

export interface GrammarExplainResult {
  is_correct?: boolean | null;
  corrected_sentence?: string | null;
  explanation: string;
  examples: string[];
  difficulty?: string | null;
}

export interface WritingAiFeedback {
  label: string;
  score?: number | null;
  corrected_answer?: string | null;
  strengths: string[];
  mistakes: string[];
  grammar_feedback: string[];
  vocabulary_feedback: string[];
  suggestions: string[];
}
