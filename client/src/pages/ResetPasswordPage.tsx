import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setError("Invalid or expired reset link");
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError("No active recovery session");
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      navigate("/auth");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        Checking reset link...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        <div className="text-center space-y-2">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => navigate("/auth")}
            className="text-blue-400 underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Set new password</h1>

        {success ? (
          <p className="text-green-400 text-center">
            Password updated! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-white/10 border border-white/10"
            />

            <button
              disabled={submitting}
              className="w-full bg-white text-black py-2 rounded font-medium hover:bg-gray-200"
            >
              {submitting ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
