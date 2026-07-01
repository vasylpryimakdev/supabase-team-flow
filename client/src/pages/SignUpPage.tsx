import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { authService } from "../services/auth.service";
import { handleError } from "../shared/errors/handleError";

// Проста схема валідації для Sign In
const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: SignInForm) => {
    try {
      await authService.signIn(data.email, data.password);
      navigate("/onboarding");
    } catch (error) {
      handleError(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-4">
        <CardHeader className="mb-2">
          <CardTitle className="text-center text-3xl font-bold text-white">
            Sign in
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              className="h-10 w-full bg-white text-black hover:bg-white/90 transition"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : "Sign in"}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="h-10 w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            >
              Continue with Google
            </Button>

            <div className="flex flex-col gap-2 text-center text-sm text-white/60">
              <Link to="/auth/signup" className="text-white underline">
                Don't have an account? Sign up
              </Link>
              <Link
                to="/auth/forgot-password"
                className="text-white/60 hover:text-white underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
