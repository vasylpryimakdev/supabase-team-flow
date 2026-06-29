import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { Spinner } from "./Spinner";

export function AppGate() {
  const { user, team, status } = useAuthStore();

  if (status === "loading") {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!team) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
