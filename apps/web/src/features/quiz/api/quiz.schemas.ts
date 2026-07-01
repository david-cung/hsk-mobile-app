import { z } from 'zod';

export const QuestionTypeSchema = z.enum([
  'multiple_choice',
  'fill_blank',
  'match_words',
  'listening',
]);

export const QuestionSchema = z.object({
  id: z.number().int(),
  question_type: QuestionTypeSchema,
  prompt: z.string(),
  options: z.array(z.string()).nullable(),
  sort_order: z.number().int(),
});

export const QuestionListSchema = z.array(QuestionSchema);

export const QuizAnswersSchema = z.record(z.string(), z.string());

export const QuizSubmitInputSchema = z.object({
  answers: QuizAnswersSchema,
});

export const QuizResultItemSchema = z.object({
  question_id: z.number().int(),
  correct: z.boolean(),
  user_answer: z.string(),
  correct_answer: z.string(),
  explanation: z.string().nullable().optional(),
});

export const QuizSubmitResultSchema = z.object({
  attempt_id: z.number().int(),
  score: z.number().int(),
  total_questions: z.number().int(),
  correct_count: z.number().int(),
  results: z.array(QuizResultItemSchema),
});

export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuizAnswers = z.infer<typeof QuizAnswersSchema>;
export type QuizSubmitInput = z.infer<typeof QuizSubmitInputSchema>;
export type QuizResultItem = z.infer<typeof QuizResultItemSchema>;
export type QuizSubmitResult = z.infer<typeof QuizSubmitResultSchema>;
