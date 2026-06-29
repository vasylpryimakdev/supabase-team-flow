import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage";
import OnboardingPage from "../pages/OnboardingPage";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import SignInPage from "../pages/SignInPage";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/v1/callback" element={<AuthCallbackPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
