import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

import { QUERY_RETRY_COUNT, QUERY_STALE_TIME_MS } from '@/app/config/constants';

import { isApiError } from '../http/errors';

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= QUERY_RETRY_COUNT) {
    return false;
  }

  if (isApiError(error)) {
    if (error.status >= 400 && error.status < 500) {
      return false;
    }

    return error.isNetworkError || error.isTimeout || error.status >= 500;
  }

  return true;
}

export function createQueryClient(config?: QueryClientConfig): QueryClient {
  return new QueryClient({
    ...config,
    defaultOptions: {
      ...config?.defaultOptions,
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        retry: shouldRetryQuery,
        refetchOnWindowFocus: import.meta.env.PROD,
        ...config?.defaultOptions?.queries,
      },
      mutations: {
        retry: false,
        ...config?.defaultOptions?.mutations,
      },
    },
  });
}
