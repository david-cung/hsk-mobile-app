import type { ReactNode } from 'react';

import { Modal } from '@/components/ui/Modal';
import { ToastHost } from '@/components/ui/Toast';

import { QueryProvider } from './QueryProvider';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      {children}
      <ToastHost />
      <Modal />
    </QueryProvider>
  );
}
