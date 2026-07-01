import { supabase } from "../lib/supabase";

export const authService = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  },

  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    return data;
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;

    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  },

  forgotPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return data;
  },

  resetPassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;

    return data;
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return data;
  },

  getUser: async () => {
    return supabase.auth.getUser();
  },

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  },

  updateProfileName: async (userId: string, name: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", userId);

    if (error) throw error;

    return data;
  },

  updateAvatarUrl: async (userId: string, avatar_url: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar_url })
      .eq("id", userId);

    if (error) throw error;

    return data;
  },
};
