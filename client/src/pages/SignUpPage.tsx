import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const { error } = await authService.signUp(email, password, name);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Check your email to confirm your account");
  };

  const handleGoogle = async () => {
    const { error } = await authService.signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Sign up</button>

      <button type="button" onClick={handleGoogle}>
        Google
      </button>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <Link to="/auth/signin">Sign in</Link>
    </form>
  );
}
