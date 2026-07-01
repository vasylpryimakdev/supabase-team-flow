import { supabase } from "../lib/supabase";
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

  getTeam: async (userId: string) => {
    const { data, error } = await supabase
      .from("team_members")
      .select(`
        role,
        teams (
          id,
          name,
          invite_code
        )
      `)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) return null;

    return {
      role: data.role,
      ...(data.teams as unknown as {
        id: string;
        name: string;
        invite_code: string;
      }),
    };
  },
};
