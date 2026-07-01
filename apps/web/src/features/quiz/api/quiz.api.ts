import type { ZodType } from 'zod';

import { apiClient } from '@/services/http/axios';
import { API_ENDPOINTS } from '@/services/http/endpoints';
import { ApiError } from '@/services/http/errors';

import {
  type Question,
  QuestionListSchema,
  type QuizAnswers,
  type QuizSubmitResult,
  QuizSubmitResultSchema,
} from './quiz.schemas';

const publicRequest = { skipAuth: true } as const;

function parseResponse<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError({
      message: 'The server returned an unexpected response.',
      status: 502,
      cause: result.error,
    });
  }

  return result.data;
}

export async function getQuestions(lessonId: number): Promise<Question[]> {
  const response = await apiClient.get(
    API_ENDPOINTS.content.lessonQuestions(lessonId),
    publicRequest,
  );

  return parseResponse(QuestionListSchema, response.data);
}

export async function submitQuiz(
  lessonId: number,
  answers: QuizAnswers,
): Promise<QuizSubmitResult> {
  const response = await apiClient.post(API_ENDPOINTS.quiz.submit(lessonId), { answers });

  return parseResponse(QuizSubmitResultSchema, response.data);
}
