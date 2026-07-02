import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CreateTeam } from "../components/custom/onboarding/CreateTeam";
import { JoinTeam } from "../components/custom/onboarding/JoinTeam";
import { Button } from "../components/ui/button";
import { teamService } from "../services/team.service";
import { Spinner } from "../components/custom/Spinner";
import { useAuthStore } from "../stores/auth.store";

type Mode = "create" | "join";

export default function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loadUserContext, user } = useAuthStore();

  const [mode, setMode] = useState<Mode>("create");
  const [isJoining, setIsJoining] = useState(false);

  const code = searchParams.get("code");

  useEffect(() => {
    const handleAutoJoin = async () => {
      if (!code || !user) return;

      setIsJoining(true);
      try {
        await teamService.joinTeam(code);
        await loadUserContext(user.id);

        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Auto-join failed:", error);
        alert("Failed to join the team automatically.");
        navigate("/onboarding", { replace: true });
      } finally {
        setIsJoining(false);
      }
    };

    handleAutoJoin();
  }, [code, navigate, user, loadUserContext]);

  if (isJoining) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[420px] p-6">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl text-center">
            Create your team or join an existing one
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setMode("create")}
              variant={mode === "create" ? "default" : "outline"}
              className="flex-1 text-sm"
            >
              Create team
            </Button>

            <Button
              onClick={() => setMode("join")}
              variant={mode === "join" ? "default" : "outline"}
              className="flex-1 text-sm"
            >
              Join team
            </Button>
          </div>

          {mode === "create" ? <CreateTeam /> : <JoinTeam />}
        </CardContent>
      </Card>
    </div>
  );
}
