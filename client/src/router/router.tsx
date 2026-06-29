import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage";
import OnboardingPage from "../pages/OnboardingPage";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
