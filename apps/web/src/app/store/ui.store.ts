import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
  durationMs: number;
};

export type ModalContent = {
  title: string;
  description?: string;
};

export type ActiveModal = ModalContent & {
  id: string;
};

export type UiState = {
  isSidebarOpen: boolean;
  toasts: Toast[];
  modal: ActiveModal | null;
};

export type ShowToastInput = {
  id?: string;
  message: string;
  title?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

export type OpenModalInput = ModalContent & {
  id?: string;
};

export type UiActions = {
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  openModal: (modal: OpenModalInput) => string;
  closeModal: () => void;
  showToast: (toast: ShowToastInput) => string;
  hideToast: (id: string) => void;
};

export type UiStore = UiState & UiActions;

const DEFAULT_TOAST_DURATION_MS = 5_000;

function createUiId(prefix: 'toast' | 'modal'): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export const selectIsSidebarOpen = (state: UiStore): boolean => state.isSidebarOpen;

export const selectToasts = (state: UiStore): Toast[] => state.toasts;

export const selectActiveModal = (state: UiStore): ActiveModal | null => state.modal;

/**
 * Global UI state for layout chrome, modals, and toasts.
 * Feature-specific data must live in feature stores or query cache.
 */
export const useUiStore = create<UiStore>((set, get) => ({
  isSidebarOpen: false,
  toasts: [],
  modal: null,
  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen });
  },
  toggleSidebar: () => {
    set({ isSidebarOpen: !get().isSidebarOpen });
  },
  openModal: (modal) => {
    const id = modal.id ?? createUiId('modal');

    set({
      modal: {
        id,
        title: modal.title,
        description: modal.description,
      },
    });

    return id;
  },
  closeModal: () => {
    set({ modal: null });
  },
  showToast: (toast) => {
    const id = toast.id ?? createUiId('toast');
    const nextToast: Toast = {
      id,
      message: toast.message,
      title: toast.title,
      variant: toast.variant ?? 'default',
      durationMs: toast.durationMs ?? DEFAULT_TOAST_DURATION_MS,
    };

    set((state) => ({
      toasts: [...state.toasts, nextToast],
    }));

    return id;
  },
  hideToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
