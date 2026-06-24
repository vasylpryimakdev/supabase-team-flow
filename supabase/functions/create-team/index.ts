import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { createSupabaseUserClient } from "../_shared/supabaseClient.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getUser } from "../_shared/auth.ts";

function generateInviteCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await getUser(req);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const supabase = createSupabaseUserClient(req);

    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "Team name required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 🔴 ENFORCE ONE TEAM PER USER
    const { data: existing } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "User already has a team" }),
        { status: 400, headers: corsHeaders },
      );
    }

    let inviteCode = generateInviteCode();

    // ensure uniqueness
    let unique = false;
    while (!unique) {
      const { data } = await supabaseAdmin
        .from("teams")
        .select("id")
        .eq("invite_code", inviteCode)
        .maybeSingle();

      if (!data) unique = true;
      else inviteCode = generateInviteCode();
    }

    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .insert({
        name,
        invite_code: inviteCode,
      })
      .select()
      .single();

    if (teamError) {
      return new Response(JSON.stringify(teamError), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const { error: memberError } = await supabaseAdmin
      .from("team_members")
      .insert({
        user_id: user.id,
        team_id: team.id,
        role: "owner",
      });

    if (memberError) {
      return new Response(JSON.stringify(memberError), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ team, inviteCode }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
});
