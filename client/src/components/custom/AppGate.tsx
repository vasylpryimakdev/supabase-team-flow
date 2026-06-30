import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { Spinner } from "./Spinner";

export function AppGate() {
  const { user, team, status, isRecovery } = useAuthStore();

  if (isRecovery) return null;

  if (status === "loading") return <Spinner />;

  if (!user) return <Navigate to="/auth" replace />;

  if (!team) return <Navigate to="/onboarding" replace />;

  return <Navigate to="/dashboard" replace />;
}
