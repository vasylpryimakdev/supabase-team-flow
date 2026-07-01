import { useState } from "react";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Spinner } from "../components/custom/Spinner";
import { authService } from "../services/auth.service";
import { handleError } from "../shared/errors/handleError";

import { Mail, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-4">
        <CardHeader className="mb-2">
          <CardTitle className="text-center text-3xl font-bold text-white">
            Forgot password
          </CardTitle>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-green-400 font-medium animate-pulse">
                Check your email for password reset link.
              </p>
              <Link
                to="/auth/signin"
                className="inline-flex items-center gap-2 text-sm text-white underline hover:text-white/80 transition-colors"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full bg-white text-black hover:bg-white/90 transition"
              >
                {isSubmitting ? <Spinner /> : "Send reset link"}
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/auth/signin"
                  className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white underline transition-colors"
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
