import { useApiQuery } from '@/hooks/useApiQuery';
import type { ApiError } from '@/services';
import { queryKeys } from '@/services/query/keys';

import { getLessons } from '../api/lessons.api';
import type { LessonListItem, LessonType } from '../api/lessons.schemas';

type LessonsQueryKey = ReturnType<typeof queryKeys.lessons.levelLessons>;

type UseLessonsOptions = {
  levelId?: number;
  lessonType?: LessonType;
} & Omit<
  Parameters<typeof useApiQuery<LessonListItem[], ApiError, LessonListItem[], LessonsQueryKey>>[0],
  'enabled' | 'queryFn' | 'queryKey'
> & {
    enabled?: boolean;
  };

export function useLessons({ levelId, lessonType, enabled = true, ...options }: UseLessonsOptions) {
  const isLevelIdDefined = levelId !== undefined;

  return useApiQuery({
    queryKey: queryKeys.lessons.levelLessons(levelId ?? 0, lessonType),
    queryFn: () => getLessons(levelId as number, { lessonType }),
    enabled: isLevelIdDefined && enabled,
    ...options,
  });
}

export type { UseLessonsOptions };
