import type { ReactNode } from 'react';

import { ErrorState } from '@/components/ui/ErrorState';

type QueryContentProps<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T | undefined;
  isEmpty?: (data: T) => boolean;
  errorMessage?: string;
  onRetry?: () => void;
  loading: ReactNode;
  empty: ReactNode;
  error?: ReactNode;
  children: (data: T) => ReactNode;
};

export function QueryContent<T>({
  isLoading,
  isError,
  data,
  isEmpty,
  errorMessage,
  onRetry,
  loading,
  empty,
  error,
  children,
}: QueryContentProps<T>) {
  if (isLoading) {
    return loading;
  }

  if (isError) {
    return (
      error ?? (
        <ErrorState description={errorMessage} onRetry={onRetry} title="Could not load content" />
      )
    );
  }

  if (data === undefined || isEmpty?.(data)) {
    return empty;
  }

  return children(data);
}

export type { QueryContentProps };
