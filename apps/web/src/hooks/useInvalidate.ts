import { type QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useInvalidate() {
  const queryClient = useQueryClient();

  const invalidate = useCallback(
    async (...queryKeys: QueryKey[]) => {
      await Promise.all(
        queryKeys.map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey,
          }),
        ),
      );
    },
    [queryClient],
  );

  return invalidate;
}
