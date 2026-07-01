import type { Toast as ToastData, ToastVariant } from '@/app/store/ui.store';
import { cn } from '@/utils';

type ToastProps = {
  toast: ToastData;
  onDismiss: (id: string) => void;
};

const toastVariantStyles: Record<ToastVariant, string> = {
  default: 'border-outline-variant/30 bg-surface-container-lowest text-on-surface',
  success: 'border-tertiary-fixed-dim bg-tertiary-fixed text-on-tertiary-fixed',
  error: 'border-error bg-error-container text-on-error-container',
  info: 'border-secondary-fixed-dim bg-secondary-fixed text-on-secondary-fixed',
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const isError = toast.variant === 'error';

  return (
    <div
      aria-live={isError ? 'assertive' : 'polite'}
      className={cn(
        'flex items-start gap-stack-sm rounded-xl border p-stack-md shadow-card',
        toastVariantStyles[toast.variant],
      )}
      role={isError ? 'alert' : 'status'}
    >
      <div className="min-w-0 flex-1">
        {toast.title ? <p className="m-0 text-label-md font-semibold">{toast.title}</p> : null}
        <p className={cn('m-0 text-body-md', toast.title && 'mt-1')}>{toast.message}</p>
      </div>
      <button
        aria-label="Dismiss notification"
        className={cn(
          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
          'text-current transition-colors hover:bg-black/5',
          'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus',
        )}
        onClick={() => onDismiss(toast.id)}
        type="button"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

export type { ToastProps };
