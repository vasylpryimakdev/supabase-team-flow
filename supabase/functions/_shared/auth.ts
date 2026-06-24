import { createSupabaseUserClient } from "./supabaseClient.ts";

export async function getUser(req: Request) {
  const supabase = createSupabaseUserClient(req);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("Invalid auth token");
  }

  return user;
}