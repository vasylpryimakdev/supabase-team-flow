import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Subscription } from "@supabase/supabase-js";
import { authService } from "../services/auth.service";
import { teamService } from "../services/team.service";
import { useTeamStore } from "./teamStore";
import type { Profile } from "../types/profile.type";
import { handleError } from "../shared/errors/handleError";

type User = { id: string; email: string | null };
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  status: AuthStatus;
  initialized: boolean;
  isRecovery: boolean;

  initAuth: () => void;
  loadUserContext: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  setRecovery: (isRecovery: boolean) => void;

  updateProfileName: (name: string) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
}

let subscription: Subscription | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  status: "loading",
  initialized: false,
  isRecovery: false,

  loadUserContext: async (userId: string) => {
    useTeamStore.getState().setLoading(true);

    try {
      const profile = await authService.getProfile(userId);
      set({ profile });

      if (profile?.team_id) {
        const team = await teamService.getTeamById(profile.team_id);
        useTeamStore.getState().setTeam(team);
      } else {
        useTeamStore.getState().clearTeam();
      }
    } catch (error) {
      handleError(error);
      set({ profile: null });
      useTeamStore.getState().clearTeam();
    } finally {
      useTeamStore.getState().setLoading(false);
    }
  },

  updateProfileName: async (name: string) => {
    const { profile } = get();
    if (!profile) return;

    await supabase
      .from("profiles")
      .update({ name })
      .eq("id", profile.id);

    set({ profile: { ...profile, name } });
  },

  updateAvatar: async (avatarUrl: string) => {
    const { profile } = get();
    if (!profile) return;

    await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", profile.id);

    set({ profile: { ...profile, avatar_url: avatarUrl } });
  },

  initAuth: () => {
    if (get().initialized) return;
    set({ initialized: true, status: "loading" });

    const init = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type");
      if (type === "recovery") {
        set({ isRecovery: true });
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          set({ user: null, profile: null, status: "unauthenticated" });
          useTeamStore.getState().clearTeam();
          return;
        }

        set({
          user: { id: session.user.id, email: session.user.email ?? null },
          status: "authenticated",
        });
        await get().loadUserContext(session.user.id);
      } catch {
        set({ user: null, profile: null, status: "unauthenticated" });
        useTeamStore.getState().clearTeam();
      }
    };

    init();

    if (!subscription) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_OUT") {
            set({ user: null, profile: null, status: "unauthenticated" });
            useTeamStore.getState().clearTeam();
          } else if (event === "SIGNED_IN" && session?.user) {
            set({
              user: { id: session.user.id, email: session.user.email ?? null },
              status: "authenticated",
            });
            await get().loadUserContext(session.user.id);
          }
        },
      );
      subscription = data.subscription;
    }
  },

  setRecovery: (isRecovery: boolean) => set({ isRecovery }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, status: "unauthenticated" });
    useTeamStore.getState().clearTeam();
  },
}));
