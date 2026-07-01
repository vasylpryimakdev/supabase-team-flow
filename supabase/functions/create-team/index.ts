import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

function generateInviteCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

async function generateUniqueInviteCode() {
  let code = "";

  for (let i = 0; i < 5; i++) {
    code = generateInviteCode();

    const { data } = await supabaseAdmin
      .from("teams")
      .select("id")
      .eq("invite_code", code)
      .maybeSingle();

    if (!data) return code;
  }

  throw new Error("Failed to generate unique invite code");
}

export default Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return Response.json({ error: "Missing Authorization header" }, {
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } = await supabaseAdmin.auth
      .getUser(token);

    if (userError || !userData?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = userData.user;

    const body = await req.json().catch(() => null);

    const teamName = body?.teamName?.trim();

    if (!teamName) {
      return Response.json(
        { error: "Team name is required" },
        { status: 400 },
      );
    }

    const { data: existingMember } = await supabaseAdmin
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingMember) {
      return Response.json(
        { error: "User already has a team" },
        { status: 400 },
      );
    }

    const invite_code = await generateUniqueInviteCode();

    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .insert({
        name: teamName,
        invite_code,
      })
      .select()
      .single();

    if (teamError || !team) {
      return Response.json(
        { error: teamError?.message ?? "Team creation failed" },
        { status: 500 },
      );
    }

    const { error: memberError } = await supabaseAdmin
      .from("team_members")
      .insert({
        user_id: user.id,
        team_id: team.id,
        role: "owner",
      });

    if (memberError) {
      return Response.json(
        { error: memberError.message },
        { status: 500 },
      );
    }

    return Response.json({
      team,
      invite_code,
    });
  } catch (err) {
    console.error("Create team error:", err);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
