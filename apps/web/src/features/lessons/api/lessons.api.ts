import type { ZodType } from 'zod';

import { apiClient } from '@/services/http/axios';
import { API_ENDPOINTS } from '@/services/http/endpoints';
import { ApiError } from '@/services/http/errors';

import {
  type HskLevel,
  HskLevelListSchema,
  type LessonDetail,
  LessonDetailSchema,
  type LessonListItem,
  LessonListSchema,
  type LessonType,
} from './lessons.schemas';

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

export async function getLevels(): Promise<HskLevel[]> {
  const response = await apiClient.get(API_ENDPOINTS.content.levels, publicRequest);

  return parseResponse(HskLevelListSchema, response.data);
}

type GetLessonsOptions = {
  lessonType?: LessonType;
};

export async function getLessons(
  levelId: number,
  options: GetLessonsOptions = {},
): Promise<LessonListItem[]> {
  const response = await apiClient.get(API_ENDPOINTS.content.levelLessons(levelId), {
    params: options.lessonType ? { lesson_type: options.lessonType } : undefined,
  });

  return parseResponse(LessonListSchema, response.data);
}

export async function getLesson(lessonId: number): Promise<LessonDetail> {
  const response = await apiClient.get(API_ENDPOINTS.content.lesson(lessonId), publicRequest);

  return parseResponse(LessonDetailSchema, response.data);
}

export type { GetLessonsOptions };
