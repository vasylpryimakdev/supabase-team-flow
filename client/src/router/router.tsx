import { BrowserRouter, Routes, Route } from "react-router-dom";

import OnboardingPage from "../pages/OnboardingPage";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import NotFoundPage from "../pages/NotFoundPage";
import { AppGate } from "../components/custom/AppGate";
import AuthPage from "../pages/AuthPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import Dashboard from "../components/custom/Dashboard";
import { ProtectedRoute } from "../components/custom/ProtectedRoute";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppGate />} />

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/v1/callback" element={<AuthCallbackPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
