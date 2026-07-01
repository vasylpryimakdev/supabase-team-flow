import { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export function JoinTeam() {
  const [code, setCode] = useState("");

  const isDisabled = !code.trim();

  const handleJoin = async () => {
    if (isDisabled) return;

    await fetch("/api/join-team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
      }),
    });
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Invite code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <Button disabled={isDisabled} onClick={handleJoin}>
        Join team
      </Button>
    </div>
  );
}
