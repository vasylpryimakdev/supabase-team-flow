import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/auth.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/custom/Spinner";
import { User } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await authService.signUp(email, password, name);

    if (error) {
      setError(error.message);
      return;
    }

    setLoading(false);

    setSuccess("Check your email to confirm your account");
  };

  const handleGoogleSignIn = async () => {
    const { error } = await authService.signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-4">
        <CardHeader className="mb-2">
          <CardTitle className="text-center text-3xl font-bold text-white">
            Create account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-3 text-white/50 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div>
              <Button
                className="h-10 w-full bg-white text-black hover:bg-white/90 transition"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Create account"}
              </Button>
              {error && (
                <span className="block text-sm text-red-400">{error}</span>
              )}

              {success && (
                <span className="block text-sm text-green-400">{success}</span>
              )}
            </div>
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="h-10 w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            >
              Continue with Google
            </Button>

            <p className="text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link to="/auth/signin" className="text-white underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
