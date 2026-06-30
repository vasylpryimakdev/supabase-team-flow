import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import { CreateTeam } from "../components/custom/onboarding/CreateTeam";
import { JoinTeam } from "../components/custom/onboarding/JoinTeam";
import { Button } from "../components/ui/button";

type Mode = "create" | "join";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("create");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[420px] p-4">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl">Welcome 👋</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

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

          {mode === "create" ? (
            <CreateTeam userName={name} />
          ) : (
            <JoinTeam userName={name} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
