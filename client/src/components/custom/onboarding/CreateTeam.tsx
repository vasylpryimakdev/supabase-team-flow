import { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

type Props = {
  userName: string;
};

export function CreateTeam({ userName }: Props) {
  const [teamName, setTeamName] = useState("");

  const isDisabled = !userName.trim() || !teamName.trim();

  const handleCreate = async () => {
    if (isDisabled) return;

    await fetch("/api/create-team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamName,
        userName,
      }),
    });
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Create team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <Button disabled={isDisabled} onClick={handleCreate}>
        Create team
      </Button>
    </div>
  );
}
