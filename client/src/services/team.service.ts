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
};
