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
  isRecovery: boolean;

  initAuth: () => void;
  setUser: (user: User | null) => void;
  setTeam: (team: Team | null) => void;
  setStatus: (status: AuthStatus) => void;
  setRecovery: (value: boolean) => void;

  loadTeam: (userId: string) => Promise<void>;
};

let authSubscription:
  | ReturnType<typeof supabase.auth.onAuthStateChange>
  | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  team: null,
  status: "loading",
  initialized: false,
  isRecovery: false,

  setUser: (user) => set({ user }),
  setTeam: (team) => set({ team }),
  setStatus: (status) => set({ status }),
  setRecovery: (value) => set({ isRecovery: value }),

  loadTeam: async (userId) => {
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
    if (get().initialized) return;

    set({ status: "loading", initialized: true });

    const hash = window.location.hash;
    const isRecovery = hash.includes("type=recovery");

    set({ isRecovery });

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session?.user) {
        set({
          user: null,
          team: null,
          status: "unauthenticated",
        });
        return;
      }

      const user = {
        id: session.user.id,
        email: session.user.email ?? null,
      };

      set({
        user,
        status: "authenticated",
      });

      await get().loadTeam(user.id);
    };

    loadSession();

    if (!authSubscription) {
      authSubscription = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const user = session?.user
            ? {
              id: session.user.id,
              email: session.user.email ?? null,
            }
            : null;

          if (!user) {
            set({
              user: null,
              team: null,
              status: "unauthenticated",
            });
            return;
          }

          set({
            user,
            status: "authenticated",
          });

          await get().loadTeam(user.id);
        },
      );
    }
  },
}));
