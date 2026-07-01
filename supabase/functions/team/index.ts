import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseClient.ts";

async function getUser(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth) throw new Error("Missing auth header");

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
  throw new Error("Failed to generate a unique invite code");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getUser(req);
    const method = req.method;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("team_id, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return error("User profile not found", 404);
    }

    if (method === "POST") {
      const body = await req.json().catch(() => null);
      const teamName = body?.teamName?.trim();

      if (!teamName) return error("Team name is required");
      if (profile.team_id) return error("User already has a team", 400);

      const inviteCode = await createUniqueInviteCode();
      const { data: team, error: teamError } = await supabaseAdmin
        .from("teams")
        .insert({ name: teamName, invite_code: inviteCode })
        .select()
        .single();

      if (teamError || !team) {
        return error(teamError?.message ?? "Failed to create team", 500);
      }

      await supabaseAdmin
        .from("profiles")
        .update({ team_id: team.id, role: "owner" })
        .eq("id", user.id);

      return json({ team, inviteCode });
    }

    if (method === "PUT") {
      const body = await req.json().catch(() => null);
      const inviteCode = body?.inviteCode?.trim()?.toUpperCase();

      if (!inviteCode) return error("Invite code required");
      if (profile.team_id) return error("Already in a team", 400);

      const { data: team } = await supabaseAdmin
        .from("teams")
        .select("*")
        .eq("invite_code", inviteCode)
        .maybeSingle();

      if (!team) return error("Team not found or invalid code", 404);

      await supabaseAdmin
        .from("profiles")
        .update({ team_id: team.id, role: "member" })
        .eq("id", user.id);

      return json({ team });
    }

    if (method === "DELETE") {
      if (!profile.team_id) return error("You are not in a team", 400);

      if (profile.role === "owner") {
        return error(
          "Owners cannot leave the team. You must delete the team instead.",
          400,
        );
      }

      const { error: leaveError } = await supabaseAdmin
        .from("profiles")
        .update({ team_id: null, role: "member" })
        .eq("id", user.id);

      if (leaveError) return error(leaveError.message, 500);

      return json({ success: true });
    }

    return error("Method not allowed", 405);
  } catch (e) {
    return error((e as Error).message, 401);
  }
});
