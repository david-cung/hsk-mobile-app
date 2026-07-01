import { useCallback, useEffect, useState } from 'react';

type MockQueryOptions = {
  delayMs?: number;
  forceError?: boolean;
};

type MockQueryResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  refetch: () => void;
};

function readDemoState(): 'error' | 'success' | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = new URLSearchParams(window.location.search).get('demo');
  if (value === 'error') {
    return 'error';
  }
  if (value === 'success') {
    return 'success';
  }

  return null;
}

export function useMockQuery<T>(sourceData: T, options: MockQueryOptions = {}): MockQueryResult<T> {
  const { delayMs = 420, forceError = false } = options;
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    setStatus('loading');

    const demoState = readDemoState();
    const shouldError = forceError || demoState === 'error';

    const timer = window.setTimeout(() => {
      setStatus(shouldError ? 'error' : 'success');
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [attempt, delayMs, forceError]);

  const refetch = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  return {
    data: status === 'success' ? sourceData : undefined,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
    error: status === 'error' ? new Error('Failed to load data') : null,
    refetch,
  };
}
