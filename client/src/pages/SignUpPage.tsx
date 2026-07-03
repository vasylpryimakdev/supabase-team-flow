import { useState } from "react";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Spinner } from "../components/custom/common/Spinner";

import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

import { authService } from "../services/auth.service";
import { handleError } from "../shared/errors/handleError";

import {
  signUpSchema,
  type SignUpForm,
} from "../shared/schemas/sign-up.schema";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      await authService.signUp(data.name, data.email, data.password);
    } catch (error) {
      handleError(error);
    }
  };

  const handleGoogleSignUp = async () => {
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
            Sign up
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
                <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                <Input
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                  className="h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {errors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                <p className="mt-1 text-sm text-red-400">
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
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  className="h-10 pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full bg-white text-black hover:bg-white/90 transition"
            >
              {isSubmitting ? <Spinner /> : "Sign up"}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleSignUp}
              className="h-10 w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            >
              Continue with Google
            </Button>

            <div className="text-center text-sm text-white/60">
              <Link to="/auth/signin" className="text-white underline">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
