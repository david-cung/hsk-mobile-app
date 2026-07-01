import { useApiQuery } from '@/hooks/useApiQuery';
import type { ApiError } from '@/services';
import { queryKeys } from '@/services/query/keys';

import { getQuestions } from '../api/quiz.api';
import type { Question } from '../api/quiz.schemas';

type QuizQuestionsQueryKey = ReturnType<typeof queryKeys.content.lessonQuestions>;

type UseQuizQuestionsOptions = {
  lessonId?: number;
} & Omit<
  Parameters<typeof useApiQuery<Question[], ApiError, Question[], QuizQuestionsQueryKey>>[0],
  'enabled' | 'queryFn' | 'queryKey'
> & {
    enabled?: boolean;
  };

export function useQuizQuestions({
  lessonId,
  enabled = true,
  ...options
}: UseQuizQuestionsOptions) {
  const isLessonIdDefined = lessonId !== undefined;

  return useApiQuery({
    queryKey: queryKeys.content.lessonQuestions(lessonId ?? 0),
    queryFn: () => getQuestions(lessonId as number),
    enabled: isLessonIdDefined && enabled,
    ...options,
  });
}

export type { UseQuizQuestionsOptions };
