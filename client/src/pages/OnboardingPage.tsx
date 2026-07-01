import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { CreateTeam } from "../components/custom/onboarding/CreateTeam";
import { JoinTeam } from "../components/custom/onboarding/JoinTeam";
import { Button } from "../components/ui/button";

type Mode = "create" | "join";

export default function OnboardingPage() {
  const [mode, setMode] = useState<Mode>("create");

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
