import { supabaseAdmin } from "../_shared/supabaseClient.ts";

function generateInviteCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response("Missing Authorization header", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } = await supabaseAdmin.auth
      .getUser(token);

    if (userError || !userData?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = userData.user;

    const { teamName } = await req.json();

    if (!teamName?.trim()) {
      return new Response("Team name is required", { status: 400 });
    }

    const { data: existingMember } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingMember) {
      return new Response("User already has a team", { status: 400 });
    }

    const invite_code = generateInviteCode();

    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .insert({
        name: teamName,
        invite_code,
      })
      .select()
      .single();

    if (teamError || !team) {
      return new Response(teamError?.message || "Team creation failed", {
        status: 500,
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
      return new Response(memberError.message, { status: 500 });
    }

    return new Response(
      JSON.stringify({
        team,
        invite_code,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
});
