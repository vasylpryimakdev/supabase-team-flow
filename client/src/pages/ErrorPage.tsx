import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

type Props = {
  onReset?: () => void;
  error?: string | null;
};

export const ErrorPage = ({ onReset, error }: Props) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onReset?.();
    navigate("/");
  };

  const handleRetry = () => {
    onReset?.();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md border-red-500/20 bg-red-500/5 backdrop-blur-xl">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 rounded-full bg-red-500/10">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>

          <CardTitle className="text-xl text-white">
            Something went wrong
          </CardTitle>

          <p className="text-sm text-white/60">
            We encountered an unexpected error
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-300 bg-red-500/10 p-3 rounded-md border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleRetry}
            >
              Retry
            </Button>

            <Button className="w-full" onClick={handleGoHome}>
              Go home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
