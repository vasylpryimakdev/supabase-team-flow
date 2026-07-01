import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Missing auth");

  return authHeader.replace("Bearer ", "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const token = getUserFromToken(req);

    const { data: { user } } = await supabaseAdmin.auth.getUser(token);

    if (!user) {
      return new Response("Unauthorized", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { inviteCode } = await req.json();

    if (!inviteCode) {
      return new Response("Invite code required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: team } = await supabaseAdmin
      .from("teams")
      .select("*")
      .eq("invite_code", inviteCode.trim().toUpperCase())
      .maybeSingle();

    if (!team) {
      return new Response("Team not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    const { data: existing } = await supabaseAdmin
      .from("team_members")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return new Response("User already in team", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { error } = await supabaseAdmin
      .from("team_members")
      .insert({
        user_id: user.id,
        team_id: team.id,
        role: "member",
      });

    if (error) {
      return new Response(error.message, { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify(team), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(String(e), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
