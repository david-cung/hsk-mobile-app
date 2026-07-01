import { useAuthStore } from '@/app/store/auth.store';
import { useApiMutation } from '@/hooks/useApiMutation';
import type { ApiError } from '@/services';

import { login } from '../api/auth.api';
import type { LoginInput, TokenResponse } from '../api/auth.schemas';

type UseLoginOptions = Omit<
  Parameters<typeof useApiMutation<TokenResponse, ApiError, LoginInput>>[0],
  'mutationFn' | 'onSuccess'
> & {
  onSuccess?: (
    data: TokenResponse,
    variables: LoginInput,
    context: unknown,
  ) => void | Promise<void>;
};

export function useLogin(options?: UseLoginOptions) {
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useApiMutation({
    mutationFn: login,
    ...mutationOptions,
    onSuccess: async (data, variables, context) => {
      useAuthStore.getState().setToken(data.access_token);
      await onSuccess?.(data, variables, context);
    },
  });
}
