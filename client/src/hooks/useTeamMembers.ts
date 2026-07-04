import { useQuery } from "@tanstack/react-query";
import { useTeamStore } from "../stores/teamStore";
import type { TeamMember } from "../types/team.types";
import { teamService } from "../services/team.service";

export const useTeamMembers = (teamId?: string) => {
  const onlineUserIds = useTeamStore((s) => s.onlineUserIds);

  const query = useQuery<TeamMember[]>({
    queryKey: ["team-members", teamId],
    queryFn: () => teamService.getTeamMembers(teamId!),
    enabled: !!teamId,
  });

  return {
    ...query,
    data: query.data?.map((member) => ({
      ...member,
      isOnline: onlineUserIds.includes(member.id),
    })),
  };
};
