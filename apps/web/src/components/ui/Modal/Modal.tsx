import { type SyntheticEvent, useEffect, useId, useRef } from 'react';

import { selectActiveModal, useUiStore } from '@/app/store/ui.store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function Modal() {
  const modal = useUiStore(selectActiveModal);
  const closeModal = useUiStore((state) => state.closeModal);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (modal) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
      if (!dialog.open) {
        dialog.showModal();
      }

      const focusableElements = panelRef.current ? getFocusableElements(panelRef.current) : [];
      focusableElements[0]?.focus();
      return;
    }

    if (dialog.open) {
      dialog.close();
    }

    previouslyFocusedElementRef.current?.focus();
    previouslyFocusedElementRef.current = null;
  }, [modal]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusableElements = getFocusableElements(panelRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [modal]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    closeModal();
  };

  return (
    <dialog
      aria-describedby={modal?.description ? descriptionId : undefined}
      aria-labelledby={titleId}
      aria-modal="true"
      className={cn(
        'fixed inset-0 z-[100] m-0 h-dvh w-full max-h-none max-w-none border-0 bg-transparent p-0',
      )}
      onCancel={handleCancel}
      ref={dialogRef}
    >
      {modal ? (
        <div className="relative flex min-h-full items-center justify-center px-margin-mobile py-stack-lg">
          <button
            aria-label="Close dialog"
            className="absolute inset-0 border-0 bg-inverse-surface/60 p-0"
            onClick={closeModal}
            tabIndex={-1}
            type="button"
          />
          <div
            className="relative z-10 w-full max-w-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-card-padding shadow-card"
            ref={panelRef}
          >
            <h2 className="m-0 text-headline-md text-on-surface" id={titleId}>
              {modal.title}
            </h2>
            {modal.description ? (
              <p
                className="m-0 mt-stack-sm text-body-md text-on-surface-variant"
                id={descriptionId}
              >
                {modal.description}
              </p>
            ) : null}
            <div className="mt-stack-md flex justify-end">
              <Button onClick={closeModal} type="button" variant="secondary">
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
