import { create } from "zustand";
import type { Team } from "../types/team.types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface TeamStore {
  team: Team | null;
  isLoading: boolean;
  onlineUserIds: string[];
  channel: RealtimeChannel | null;

  setTeam: (team: Team | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearTeam: () => void;

  initPresence: (teamId: string) => void;
  cleanupPresence: () => void;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  team: null,
  isLoading: false,
  onlineUserIds: [],
  channel: null,

  setTeam: (team) => set({ team }),
  setLoading: (isLoading) => set({ isLoading }),
  clearTeam: () => {
    get().cleanupPresence();
    set({ team: null });
  },

  initPresence: (teamId: string) => {
    if (get().channel) return;

    const channel = supabase.channel(`team:${teamId}:presence`);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{ user_id: string }>();
        const onlineIds = Object.values(state)
          .flat()
          .map((p) => p.user_id);
        set({ onlineUserIds: onlineIds });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) await channel.track({ user_id: user.id });
        }
      });

    set({ channel });
  },

  cleanupPresence: () => {
    const { channel } = get();
    if (channel) {
      supabase.removeChannel(channel);
      set({ channel: null, onlineUserIds: [] });
    }
  },
}));
