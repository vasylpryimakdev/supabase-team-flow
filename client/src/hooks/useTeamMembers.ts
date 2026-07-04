import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { teamService } from "../services/team.service";
import { supabase } from "../lib/supabase";
import type { TeamMember } from "../types/team.types";

interface PresenceData {
  user_id: string;
}

export const useTeamMembers = (teamId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<TeamMember[]>({
    queryKey: ["team-members", teamId],
    queryFn: () => teamService.getTeamMembers(teamId!),
    enabled: !!teamId,
  });

  useEffect(() => {
    if (!teamId) return;

    const channel = supabase.channel(`team:${teamId}:presence`);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceData>();

        queryClient.setQueryData<TeamMember[]>(
          ["team-members", teamId],
          (old) => {
            if (!old) return old;

            return old.map((member) => ({
              ...member,
              isOnline: Object.values(state).some((presences) =>
                presences.some((p) => p.user_id === member.id)
              ),
            }));
          },
        );
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            await channel.track({ user_id: user.id } as PresenceData);
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, queryClient]);

  return query;
};
