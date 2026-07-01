import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Subscription } from "@supabase/supabase-js";
import { authService } from "../services/auth.service";
import { teamService } from "../services/team.service";
import type { Profile } from "../types/profile.type";
import type { Team } from "../types/team.type";
import { handleError } from "../shared/errors/handleError";

type User = { id: string; email: string | null };
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  team: Team | null | undefined;
  status: AuthStatus;
  initialized: boolean;
  isTeamLoading: boolean;

  initAuth: () => void;
  loadUserContext: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;

  updateProfileName: (name: string) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
}

let subscription: Subscription | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  team: undefined,
  status: "loading",
  initialized: false,
  isTeamLoading: false,

  loadUserContext: async (userId: string) => {
    set({ isTeamLoading: true });
    try {
      const profile = await authService.getProfile(userId);
      set({ profile });

      if (profile?.team_id) {
        const team = await teamService.getTeamById(profile.team_id);

        set({ team });
      } else {
        set({ team: null });
      }
    } catch (error) {
      handleError(error);
      set({ team: null, profile: null });
    } finally {
      set({ isTeamLoading: false });
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
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          set({
            user: null,
            profile: null,
            team: null,
            status: "unauthenticated",
          });
          return;
        }

        set({
          user: { id: session.user.id, email: session.user.email ?? null },
          status: "authenticated",
        });

        await get().loadUserContext(session.user.id);
      } catch {
        set({
          user: null,
          profile: null,
          team: null,
          status: "unauthenticated",
        });
      }
    };

    init();

    if (!subscription) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_OUT") {
            set({
              user: null,
              profile: null,
              team: null,
              status: "unauthenticated",
            });
          } else if (event === "SIGNED_IN" && session?.user) {
            const user = {
              id: session.user.id,
              email: session.user.email ?? null,
            };
            set({ user, status: "authenticated" });
            await get().loadUserContext(user.id);
          }
        },
      );
      subscription = data.subscription;
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, team: null, status: "unauthenticated" });
  },
}));
