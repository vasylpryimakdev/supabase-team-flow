import { useEffect } from "react";
import { Router } from "./router/router";
import { useAuthStore } from "./stores/auth.store";
import { Toaster } from "sonner";
import { ToastHost } from "./components/custom/common/ToastHost";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <ToastHost />
      <Router />
    </QueryClientProvider>
  );
}
