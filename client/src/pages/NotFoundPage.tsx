import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>

      <p className="text-white/60 text-center mb-6">
        Oops... the page you're looking for doesn't exist.
      </p>

      <Link to="/signin">
        <Button className="bg-white text-black hover:bg-white/90">
          Go to Sign In
        </Button>
      </Link>
    </div>
  );
}
