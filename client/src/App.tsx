import { useEffect } from "react";
import { Router } from "./router/router";
import { useAuthStore } from "./stores/auth.store";
import { Toaster } from "sonner";
import { ToastHost } from "./components/custom/ToastHost";

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <ToastHost />
      <Router />
    </>
  );
}
