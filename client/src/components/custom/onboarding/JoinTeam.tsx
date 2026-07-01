import { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { teamService } from "../../../services/team.service";
import { authService } from "../../../services/auth.service";

export function JoinTeam() {
  const [code, setCode] = useState("");

  const isDisabled = !code.trim();

  const handleJoin = async () => {
    const { data } = await authService.getSession();
    const token = data.session?.access_token;

    if (!token) return;
    if (isDisabled) return;

    await teamService.joinTeam({ inviteCode: code, token });
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
