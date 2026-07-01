import { supabase } from "../lib/supabase";
import type { Team } from "../types/team.type";
import { api } from "./api";

export const teamService = {
  createTeam: (data: { teamName: string; token: string }) => {
    return api.post("team", { teamName: data.teamName }, data.token);
  },

  joinTeam: (data: { inviteCode: string; token: string }) => {
    return api.put("team", { inviteCode: data.inviteCode }, data.token);
  },

  leaveTeam: (data: { token: string }) => {
    return api.del("team", {}, data.token);
  },

  async getTeamById(teamId: string): Promise<Team | null> {
    const { data, error } = await supabase
      .from("teams")
      .select("id, name, invite_code")
      .eq("id", teamId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
