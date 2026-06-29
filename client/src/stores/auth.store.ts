import { create } from "zustand";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  email: string | null;
};

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthStore = {
  user: User | null;
  status: AuthStatus;
  initialized: boolean;

  initAuth: () => void;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: "loading",
  initialized: false,

  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),

  initAuth: () => {
    let mounted = true;

    const init = async () => {
      set({ status: "loading" });

      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (data.session?.user) {
        set({
          user: {
            id: data.session.user.id,
            email: data.session.user.email ?? null,
          },
          status: "authenticated",
          initialized: true,
        });
      } else {
        set({
          user: null,
          status: "unauthenticated",
          initialized: true,
        });
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email ?? null,
            },
            status: "authenticated",
          });
        } else {
          set({
            user: null,
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
