import { useEffect } from "react";
import { toast } from "sonner";
import { useToastStore } from "../../stores/toast.store";

export function ToastHost() {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    if (!toasts.length) return;

    const last = toasts[toasts.length - 1];

    toast[last.type](last.message, {
      onDismiss: () => removeToast(last.id),
    });

    removeToast(last.id);
  }, [toasts, removeToast]);

  return null;
}
