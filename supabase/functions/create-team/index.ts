import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../_shared/supabaseClient.ts";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

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
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization")!,
          },
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders(),
      });
    }

    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "Team name required" }), {
        status: 400,
        headers: corsHeaders(),
      });
    }

    const inviteCode = generateInviteCode();

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
        headers: corsHeaders(),
      });
    }

    const { error: memberError } = await supabaseAdmin.from("team_members")
      .insert({
        user_id: user.id,
        team_id: team.id,
        role: "owner",
      });

    if (memberError) {
      return new Response(JSON.stringify(memberError), {
        status: 500,
        headers: corsHeaders(),
      });
    }

    return new Response(
      JSON.stringify({ team, inviteCode }),
      {
        status: 200,
        headers: {
          ...corsHeaders(),
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
        headers: corsHeaders(),
      },
    );
  }
});
