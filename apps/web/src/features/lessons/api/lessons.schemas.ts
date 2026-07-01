import { z } from 'zod';

export const LessonTypeSchema = z.enum([
  'vocabulary',
  'grammar',
  'listening',
  'reading',
  'writing',
  'mixed',
]);

export const LessonStatusSchema = z.enum(['not_started', 'in_progress', 'completed']);

export const HskLevelSchema = z.object({
  id: z.number().int(),
  level_number: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  total_characters: z.number().int(),
});

export const ChineseEntrySchema = z.object({
  hanzi: z.string(),
  pinyin: z.string().optional(),
  meaning: z.string().optional(),
  strokes: z.number().int().optional(),
});

export const GrammarPointSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  examples: z.array(ChineseEntrySchema),
});

/**
 * Lesson JSON content aligned with seeded lesson payloads in the API.
 * Optional fields vary by `lesson_type`.
 */
export const LessonContentSchema = z.object({
  vocabulary: z.array(ChineseEntrySchema).optional(),
  grammar_points: z.array(GrammarPointSchema).optional(),
  passage_title: z.string().optional(),
  passage: z.array(ChineseEntrySchema).optional(),
  transcript: z.array(ChineseEntrySchema).optional(),
  characters: z.array(ChineseEntrySchema).optional(),
  tip: z.string().optional(),
});

export const LessonListItemSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  lesson_type: LessonTypeSchema,
  sort_order: z.number().int(),
  duration_minutes: z.number().int(),
  status: LessonStatusSchema.nullable(),
  score_percent: z.number().nullable(),
});

export const LessonDetailSchema = z.object({
  id: z.number().int(),
  hsk_level_id: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  lesson_type: LessonTypeSchema,
  duration_minutes: z.number().int(),
  content: LessonContentSchema.nullable(),
});

export const HskLevelListSchema = z.array(HskLevelSchema);
export const LessonListSchema = z.array(LessonListItemSchema);

export type LessonType = z.infer<typeof LessonTypeSchema>;
export type LessonStatus = z.infer<typeof LessonStatusSchema>;
export type HskLevel = z.infer<typeof HskLevelSchema>;
export type ChineseEntry = z.infer<typeof ChineseEntrySchema>;
export type GrammarPoint = z.infer<typeof GrammarPointSchema>;
export type LessonContent = z.infer<typeof LessonContentSchema>;
export type LessonListItem = z.infer<typeof LessonListItemSchema>;
export type LessonDetail = z.infer<typeof LessonDetailSchema>;
