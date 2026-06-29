import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignUpPage from "../pages/SignUpPage";
import SignInPage from "../pages/SignInPage";
import OnboardingPage from "../pages/OnboardingPage";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import NotFoundPage from "../pages/NotFoundPage";
import { ProtectedRoutes } from "../components/custom/ProtectedRoute";
import { OnboardingGuard } from "../components/custom/OnboardingGuard";
import { AppGate } from "../components/custom/AppGate";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppGate />} />

        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/v1/callback" element={<AuthCallbackPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route element={<OnboardingGuard />}>
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
