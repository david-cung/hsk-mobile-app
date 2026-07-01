import { useAuthStore } from '@/app/store/auth.store';
import { useApiMutation } from '@/hooks/useApiMutation';
import type { ApiError } from '@/services';

import { register } from '../api/auth.api';
import type { RegisterInput, TokenResponse } from '../api/auth.schemas';

type UseRegisterOptions = Omit<
  Parameters<typeof useApiMutation<TokenResponse, ApiError, RegisterInput>>[0],
  'mutationFn' | 'onSuccess'
> & {
  onSuccess?: (
    data: TokenResponse,
    variables: RegisterInput,
    context: unknown,
  ) => void | Promise<void>;
};

export function useRegister(options?: UseRegisterOptions) {
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useApiMutation({
    mutationFn: register,
    ...mutationOptions,
    onSuccess: async (data, variables, context) => {
      useAuthStore.getState().setToken(data.access_token);
      await onSuccess?.(data, variables, context);
    },
  });
}
