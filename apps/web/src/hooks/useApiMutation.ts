import {
  type MutationFunction,
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { ApiError } from '@/services';

type UseApiMutationOptions<
  TData = unknown,
  TError = ApiError,
  TVariables = void,
  TContext = unknown,
> = {
  mutationFn: MutationFunction<TData, TVariables>;
} & Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>;

export function useApiMutation<
  TData = unknown,
  TError = ApiError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseApiMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation(options);
}
