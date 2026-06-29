import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { Spinner } from "./Spinner";

export function OnboardingGuard() {
  const { team, status } = useAuthStore();

  if (status === "loading") {
    return <Spinner />;
  }

  if (!team) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
