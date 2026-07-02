import { create } from "zustand";
import type { Team } from "../types/team.type";

interface TeamStore {
  team: Team | null;
  isLoading: boolean;

  setTeam: (team: Team | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearTeam: () => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  team: null,
  isLoading: false,

  setTeam: (team) => set({ team }),
  setLoading: (isLoading) => set({ isLoading }),
  clearTeam: () => set({ team: null }),
}));
