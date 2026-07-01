import { useAuthStore } from '@/app/store/auth.store';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useInvalidate } from '@/hooks/useInvalidate';
import type { ApiError } from '@/services';
import { queryKeys } from '@/services/query/keys';

type UseLogoutOptions = Omit<
  Parameters<typeof useApiMutation<void, ApiError, void>>[0],
  'mutationFn' | 'onSuccess'
> & {
  onSuccess?: (data: void, variables: void, context: unknown) => void | Promise<void>;
};

export function useLogout(options?: UseLogoutOptions) {
  const invalidate = useInvalidate();
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useApiMutation({
    mutationFn: async () => {
      useAuthStore.getState().clearSession();
    },
    ...mutationOptions,
    onSuccess: async (data, variables, context) => {
      await invalidate(queryKeys.auth.all());
      await onSuccess?.(data, variables, context);
    },
  });
}
