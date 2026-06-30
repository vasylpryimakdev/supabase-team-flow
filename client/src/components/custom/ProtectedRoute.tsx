import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { Spinner } from "./Spinner";

export function ProtectedRoute() {
  const { user, status } = useAuthStore();

  if (status === "loading") return <Spinner />;

  if (!user) return <Navigate to="/auth" replace />;

  return <Outlet />;
}
