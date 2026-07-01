import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastState = {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (message, type = "success", duration = 3000) => {
    const id = crypto.randomUUID();

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          message,
          type,
        },
      ],
    }));

    // auto remove
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
