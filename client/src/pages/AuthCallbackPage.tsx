import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/auth.store";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      setStatus("loading");

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        setStatus("unauthenticated");
        setMessage("Authentication failed");
        navigate("/signup");
        return;
      }

      const session = data.session;

      if (!session?.user) {
        setStatus("unauthenticated");
        setMessage("No session found");
        navigate("/signup");
        return;
      }

      setUser({
        id: session.user.id,
        email: session.user.email ?? null,
      });

      setStatus("authenticated");

      navigate("/onboarding");
    };

    handleAuthCallback();
  }, [navigate, setUser, setStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
      <div className="text-center space-y-2">
        <div className="animate-pulse text-lg">{message}</div>
        <p className="text-sm text-white/50">
          Please wait while we complete your sign-in
        </p>
      </div>
    </div>
  );
}
