import { useApiQuery } from '@/hooks/useApiQuery';
import type { ApiError } from '@/services';
import { queryKeys } from '@/services/query/keys';

import { getLevels } from '../api/lessons.api';
import type { HskLevel } from '../api/lessons.schemas';

type HskLevelsQueryKey = ReturnType<typeof queryKeys.lessons.levels>;

type UseHskLevelsOptions = Omit<
  Parameters<typeof useApiQuery<HskLevel[], ApiError, HskLevel[], HskLevelsQueryKey>>[0],
  'queryFn' | 'queryKey'
>;

export function useHskLevels(options?: UseHskLevelsOptions) {
  return useApiQuery({
    queryKey: queryKeys.lessons.levels(),
    queryFn: getLevels,
    ...options,
  });
}

export type { UseHskLevelsOptions };
