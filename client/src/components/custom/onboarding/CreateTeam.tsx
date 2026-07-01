import { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { teamService } from "../../../services/team.service";
import { supabase } from "../../../lib/supabase";
import { Spinner } from "../Spinner";

export function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const isDisabled = !teamName.trim() || loading;

  const handleCreate = async () => {
    if (isDisabled) return;

    setLoading(true);

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) return;

    try {
      await teamService.createTeam({
        teamName,
        token,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Create team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <Button disabled={isDisabled} onClick={handleCreate}>
        {loading ? <Spinner /> : "Create team"}
      </Button>
    </div>
  );
}
