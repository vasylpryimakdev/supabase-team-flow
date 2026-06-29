import { useEffect } from "react";
import { Router } from "./router/router";
import { useAuthStore } from "./stores/auth.store";

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <Router />;
}
