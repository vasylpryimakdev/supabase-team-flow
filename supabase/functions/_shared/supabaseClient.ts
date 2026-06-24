import { createClient } from "@supabase/supabase-js";

const url = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

export const supabaseAdmin = createClient(url, serviceKey);
export const supabaseAnon = createClient(url, anonKey);