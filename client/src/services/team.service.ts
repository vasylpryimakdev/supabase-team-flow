import { apiPost } from "./api";

export const teamService = {
  createTeam: (data: {
    teamName: string;
    token: string;
  }) => {
    return apiPost("create-team", {
      teamName: data.teamName,
    }, data.token);
  },
};
