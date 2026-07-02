import { supabase } from "../lib/supabase";
import type { Team } from "../types/team.type";
import { api } from "./api";

export const teamService = {
  createTeam: (teamName: string) => {
    return api.post("team", { teamName });
  },

  joinTeam: (inviteCode: string) => {
    return api.put("team", { inviteCode });
  },

  leaveTeam: () => {
    return api.del("team", { action: "leave" });
  },

  deleteTeam: () => {
    return api.del("team", { action: "delete" });
  },

  updateTeamName: (teamName: string) => {
    return api.patch("team", { teamName });
  },

  inviteMember: async (data: { email: string; teamCode: string }) => {
    return api.post("invite-member", {
      email: data.email,
      teamCode: data.teamCode,
    });
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
