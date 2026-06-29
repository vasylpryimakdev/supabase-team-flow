import { create } from "zustand";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  email: string | null;
};

type Team = {
  id: string;
  name?: string;
};

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthStore = {
  user: User | null;
  team: Team | null;
  status: AuthStatus;
  initialized: boolean;

  initAuth: () => void;
  setUser: (user: User | null) => void;
  setTeam: (team: Team | null) => void;
  setStatus: (status: AuthStatus) => void;

  loadTeam: (userId: string) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  team: null,
  status: "loading",
  initialized: false,

  setUser: (user) => set({ user }),
  setTeam: (team) => set({ team }),
  setStatus: (status) => set({ status }),

  loadTeam: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("team_id")
      .eq("id", userId)
      .single();

    if (error || !data?.team_id) {
      set({ team: null });
      return;
    }

    set({
      team: { id: data.team_id },
    });
  },

  initAuth: () => {
    let mounted = true;

    const init = async () => {
      set({ status: "loading" });

      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (data.session?.user) {
        const user = {
          id: data.session.user.id,
          email: data.session.user.email ?? null,
        };

        set({
          user,
          status: "authenticated",
        });

        await get().loadTeam(user.id);
      } else {
        set({
          user: null,
          team: null,
          status: "unauthenticated",
        });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          const user = {
            id: session.user.id,
            email: session.user.email ?? null,
          };

          set({
            user,
            status: "authenticated",
          });

          await get().loadTeam(user.id);
        } else {
          set({
            user: null,
            team: null,
            status: "unauthenticated",
          });
        }
      });
    };

    init();

    return () => {
      mounted = false;
    };
  },
}));
