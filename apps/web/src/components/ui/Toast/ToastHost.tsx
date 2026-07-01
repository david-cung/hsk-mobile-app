import { useEffect } from 'react';

import { selectToasts, useUiStore } from '@/app/store/ui.store';
import { cn } from '@/utils';

import { Toast } from './Toast';

function ToastItem({ toastId }: { toastId: string }) {
  const toast = useUiStore((state) => state.toasts.find((item) => item.id === toastId));
  const hideToast = useUiStore((state) => state.hideToast);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      hideToast(toast.id);
    }, toast.durationMs);

    return () => window.clearTimeout(timeoutId);
  }, [hideToast, toast]);

  if (!toast) {
    return null;
  }

  return <Toast onDismiss={hideToast} toast={toast} />;
}

export function ToastHost() {
  const toasts = useUiStore(selectToasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Notifications"
      className={cn(
        'pointer-events-none fixed inset-x-0 z-[90] flex flex-col gap-stack-sm px-margin-mobile',
        'bottom-[calc(60px+env(safe-area-inset-bottom,0px)+1rem)]',
        'sm:bottom-stack-lg sm:left-auto sm:right-stack-lg sm:max-w-sm sm:px-0',
      )}
      role="region"
    >
      {toasts.map((toast) => (
        <div className="pointer-events-auto" key={toast.id}>
          <ToastItem toastId={toast.id} />
        </div>
      ))}
    </div>
  );
}
