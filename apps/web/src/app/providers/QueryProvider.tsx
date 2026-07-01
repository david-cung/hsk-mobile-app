import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, type ReactNode, Suspense, useState } from 'react';

import { createQueryClient } from '@/services';

const ReactQueryDevtools = lazy(async () => {
  const devtools = await import('@tanstack/react-query-devtools');
  return { default: devtools.ReactQueryDevtools };
});

type QueryProviderProps = {
  children: ReactNode;
};

function QueryDevtoolsPanel() {
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </Suspense>
  );
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <QueryDevtoolsPanel />
    </QueryClientProvider>
  );
}
