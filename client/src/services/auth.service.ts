import { supabase } from "../lib/supabase";

export const authService = {
  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signUp: async (email: string, password: string, name: string) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
  },

  signInWithGoogle: async () => {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  },

  signOut: async () => {
    return supabase.auth.signOut();
  },

  forgotPassword: async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  resetPassword: async (password: string) => {
    return supabase.auth.updateUser({
      password,
    });
  },

  getSession: async () => {
    return supabase.auth.getSession();
  },

  getUser: async () => {
    return supabase.auth.getUser();
  },
};
