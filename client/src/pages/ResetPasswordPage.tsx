import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

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

      if (error || !data.session) {
        setError("Invalid or expired reset link");
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setSubmitting(false);

    if (error) {
      if (error.message.toLowerCase().includes("different")) {
        setError("New password must be different from old password");
        return;
      }

      setError(error.message);
      return;
    }

    setSuccess(true);

    navigate("/auth", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking reset link...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-center">Set new password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {success ? (
            <p className="text-sm text-green-600 text-center">
              Password updated successfully. Redirecting...
            </p>
          ) : (
            <form onSubmit={handleReset} className="space-y-3">
              <div className="space-y-1">
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Updating..." : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
