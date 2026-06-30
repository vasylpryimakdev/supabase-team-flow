import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Subscription } from "@supabase/supabase-js";

type User = {
  id: string;
  email: string | null;
};

type Team = {
  id: string;
};

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthStore = {
  user: User | null;
  team: Team | null | undefined;
  status: AuthStatus;
  initialized: boolean;

  isRecovery: boolean;

  initAuth: () => void;
  setRecovery: (v: boolean) => void;
  loadTeam: (userId: string) => Promise<void>;
};

let subscription: Subscription | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  team: undefined,
  status: "loading",
  initialized: false,
  isRecovery: false,

  setRecovery: (v) => set({ isRecovery: v }),

  loadTeam: async (userId) => {
    set({ team: undefined });

    const { data } = await supabase
      .from("profiles")
      .select("team_id")
      .eq("id", userId)
      .single();

    set({
      team: data?.team_id ? { id: data.team_id } : null,
    });
  },

  initAuth: () => {
    if (get().initialized) return;

    set({ initialized: true, status: "loading" });

    const hash = window.location.hash || "";
    const isRecovery = hash.includes("type=recovery")

    set({ isRecovery });

    const init = async () => {
      const { data } = await supabase.auth.getSession();

      const session = data.session;

      if (!session?.user) {
        set({
          user: null,
          status: "unauthenticated",
        });
        return;
      }

      set({
        user: {
          id: session.user.id,
          email: session.user.email ?? null,
        },
        status: "authenticated",
      });

      await get().loadTeam(session.user.id);
    };

    init();

    if (!subscription) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          const user = session?.user
            ? {
              id: session.user.id,
              email: session.user.email ?? null,
            }
            : null;

          if (event === "PASSWORD_RECOVERY") {
            set({
              isRecovery: true,
              user: null,
              team: null,
              status: "unauthenticated",
            });
            return;
          }

          if (event === "SIGNED_OUT") {
            set({
              user: null,
              team: null,
              status: "unauthenticated",
            });
            return;
          }

          if (event === "SIGNED_IN" && user) {
            set({
              user,
              status: "authenticated",
            });

            await get().loadTeam(user.id);
          }
        },
      );

      subscription = data.subscription;
    }
  },
}));
