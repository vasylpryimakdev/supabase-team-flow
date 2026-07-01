import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/custom/Spinner";
import { authService } from "../services/auth.service";
import { handleError } from "../shared/errors/handleError";

import { Eye, EyeOff, Lock } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [sessionLoading, setSessionLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await authService.getSession();

        if (!data?.session) {
          handleError(new Error("Invalid or expired reset link"));
          navigate("/auth/signin");
          return;
        }
      } catch (error) {
        handleError(error);
        navigate("/auth/signin");
      } finally {
        setSessionLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await authService.resetPassword(data.password);

      setSuccess(true);

      setTimeout(() => {
        navigate("/auth/signin");
      }, 3000);
    } catch (error) {
      handleError(error);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-4">
        <CardHeader className="mb-2">
          <CardTitle className="text-center text-3xl font-bold text-white">
            Set new password
          </CardTitle>
        </CardHeader>

        <CardContent>
          {success ? (
            <p className="text-sm text-green-400 text-center font-medium animate-pulse">
              Password updated successfully. Redirecting to Sign In...
            </p>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  {...register("password")}
                  className="h-10 pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full bg-white text-black hover:bg-white/90 transition"
              >
                {isSubmitting ? <Spinner /> : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
