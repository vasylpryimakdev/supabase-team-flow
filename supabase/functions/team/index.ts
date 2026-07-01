import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseClient.ts";

async function getUser(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth) throw new Error("Missing auth");

  const token = auth.replace("Bearer ", "");

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    throw new Error("Unauthorized");
  }

  return data.user;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function error(message: string, status = 400) {
  return json({ error: message }, status);
}

function generateInviteCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

async function createUniqueInviteCode() {
  for (let i = 0; i < 5; i++) {
    const code = generateInviteCode();

    const { data } = await supabaseAdmin
      .from("teams")
      .select("id")
      .eq("invite_code", code)
      .maybeSingle();

    if (!data) return code;
  }

  throw new Error("Failed to generate invite code");
}


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getUser(req);
    const method = req.method;

    if (method === "POST") {
      const body = await req.json().catch(() => null);
      const teamName = body?.teamName?.trim();

      if (!teamName) return error("Team name is required");

      const { data: existing } = await supabaseAdmin
        .from("team_members")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        return error("User already has a team", 400);
      }

      const invite_code = await createUniqueInviteCode();

      const { data: team, error: teamError } = await supabaseAdmin
        .from("teams")
        .insert({
          name: teamName,
          invite_code,
        })
        .select()
        .single();

      if (teamError || !team) {
        return error(teamError?.message ?? "Create team failed", 500);
      }

      await supabaseAdmin.from("team_members").insert({
        user_id: user.id,
        team_id: team.id,
        role: "owner",
      });

      return json({ team, invite_code });
    }

    if (method === "PUT") {
      const body = await req.json().catch(() => null);
      const inviteCode = body?.inviteCode?.trim()?.toUpperCase();

      if (!inviteCode) return error("Invite code required");

      const { data: existing } = await supabaseAdmin
        .from("team_members")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) return error("Already in team", 400);

      const { data: team } = await supabaseAdmin
        .from("teams")
        .select("*")
        .eq("invite_code", inviteCode)
        .maybeSingle();

      if (!team) return error("Team not found", 404);

      await supabaseAdmin.from("team_members").insert({
        user_id: user.id,
        team_id: team.id,
        role: "member",
      });

      return json({ team });
    }

    if (method === "DELETE") {
      const { error: delError } = await supabaseAdmin
        .from("team_members")
        .delete()
        .eq("user_id", user.id);

      if (delError) return error(delError.message, 500);

      return json({ success: true });
    }

    return error("Method not allowed", 405);
  } catch (e) {
    return error((e as Error).message, 401);
  }
});
