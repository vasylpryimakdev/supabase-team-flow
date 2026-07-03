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

  async leaveTeam(userId: string) {
    const { error } = await supabase
      .from("profiles")
      .update({ team_id: null, role: null })
      .eq("id", userId);

    if (error) throw error;
    return true;
  },

  deleteTeam: () => {
    return api.del("team");
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
      .select("id, name, invite_code, avatar_url")
      .eq("id", teamId)
      .maybeSingle();

    if (error) throw error;

    return data as Team;
  },

  async updateTeam(
    teamId: string,
    updates: Partial<Pick<Team, "name" | "avatar_path">>,
  ) {
    const { data, error } = await supabase
      .from("teams")
      .update(updates)
      .eq("id", teamId)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error("Team not found or unauthorized to update.");
    }

    return data[0] as Team;
  },

  async updateAvatar(teamId: string, avatarPath: string) {
    return this.updateTeam(teamId, { avatar_path: avatarPath });
  },
};
