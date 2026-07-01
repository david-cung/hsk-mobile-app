import { useApiQuery } from '@/hooks/useApiQuery';
import type { ApiError } from '@/services';
import { queryKeys } from '@/services/query/keys';

import { getLesson } from '../api/lessons.api';
import type { LessonDetail } from '../api/lessons.schemas';

type LessonQueryKey = ReturnType<typeof queryKeys.lessons.lesson>;

type UseLessonOptions = {
  lessonId?: number;
} & Omit<
  Parameters<typeof useApiQuery<LessonDetail, ApiError, LessonDetail, LessonQueryKey>>[0],
  'enabled' | 'queryFn' | 'queryKey'
> & {
    enabled?: boolean;
  };

export function useLesson({ lessonId, enabled = true, ...options }: UseLessonOptions) {
  const isLessonIdDefined = lessonId !== undefined;

  return useApiQuery({
    queryKey: queryKeys.lessons.lesson(lessonId ?? 0),
    queryFn: () => getLesson(lessonId as number),
    enabled: isLessonIdDefined && enabled,
    ...options,
  });
}

export type { UseLessonOptions };
