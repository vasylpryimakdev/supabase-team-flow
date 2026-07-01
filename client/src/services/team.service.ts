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

  joinTeam: (data: {
    inviteCode: string;
    token: string;
  }) => {
    return apiPost(
      "join-team",
      {
        inviteCode: data.inviteCode,
      },
      data.token,
    );
  },
};
