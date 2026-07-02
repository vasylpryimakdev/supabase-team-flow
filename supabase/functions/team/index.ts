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
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function error(message: string, status = 400) {
  return json({ error: message }, status);
}

async function createUniqueInviteCode() {
  for (let i = 0; i < 5; i++) {
    const code = Array.from(
      { length: 6 },
      () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)],
    ).join("");
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

    if (profileError || !profile) return error("User profile not found", 404);

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

      if (teamError) return error(teamError.message, 500);

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ team_id: team.id, role: "owner" })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        console.error("Critical: Profile update failed:", updateError);
        return error(
          "Failed to assign team to profile: " + updateError.message,
          500,
        );
      }

      return json({ team, inviteCode });
    }

    if (method === "PUT") {
      const body = await req.json().catch(() => null);
      const inviteCode = body?.inviteCode?.trim()?.toUpperCase();
      if (!inviteCode) return error("Invite code required");
      if (profile.team_id) return error("Already in a team", 400);

      const { data: team } = await supabaseAdmin
        .from("teams")
        .select("id")
        .eq("invite_code", inviteCode)
        .maybeSingle();

      if (!team) return error("Team not found", 404);

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ team_id: team.id, role: "member" })
        .eq("id", user.id);

      if (updateError) {
        return error("Failed to join team: " + updateError.message, 500);
      }

      return json({ team });
    }

    if (method === "PATCH") {
      if (profile.role !== "owner") {
        return error("Only owner can update team", 403);
      }
      if (!profile.team_id) return error("No team found", 404);

      const body = await req.json().catch(() => null);
      const teamName = body?.teamName?.trim();
      if (!teamName) return error("New team name is required");

      const { error: updateError } = await supabaseAdmin
        .from("teams")
        .update({ name: teamName })
        .eq("id", profile.team_id);

      if (updateError) {
        return error("Failed to update team: " + updateError.message, 500);
      }
      return json({ message: "Team updated successfully" });
    }

    if (method === "DELETE") {
      const body = await req.json().catch(() => null);
      const action = body?.action;

      if (action === "delete") {
        if (profile.role !== "owner") {
          return error("Only owner can delete team", 403);
        }
        if (!profile.team_id) return error("No team found", 404);

        const { error: delError } = await supabaseAdmin
          .from("teams")
          .delete()
          .eq("id", profile.team_id);

        if (delError) {
          return error("Failed to delete team: " + delError.message, 500);
        }
        return json({ message: "Team deleted successfully" });
      }

      if (action === "leave") {
        if (profile.role === "owner") {
          return error("Owner cannot leave team, delete it instead", 400);
        }
        if (!profile.team_id) return error("Not in a team", 400);

        const { error: leaveError } = await supabaseAdmin
          .from("profiles")
          .update({ team_id: null, role: null })
          .eq("id", user.id);

        if (leaveError) {
          return error("Failed to leave team: " + leaveError.message, 500);
        }
        return json({ message: "Left team successfully" });
      }

      return error("Invalid delete action");
    }

    return error("Method not allowed", 405);
  } catch (e) {
    console.error("Edge Function Error:", e);
    return error((e as Error).message, 401);
  }
});
