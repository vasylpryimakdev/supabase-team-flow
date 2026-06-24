import { supabaseAnon } from "./supabaseClient.ts";

export async function getUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
  } = await supabaseAnon.auth.getUser(token);

  return user;
}