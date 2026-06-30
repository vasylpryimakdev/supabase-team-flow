import { supabaseAdmin } from "../_shared/supabaseClient.ts";

function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Missing auth");

  return authHeader.replace("Bearer ", "");
}

Deno.serve(async (req) => {
  try {
    const token = getUserFromToken(req);

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { inviteCode } = await req.json();

    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .select("*")
      .eq("invite_code", inviteCode)
      .single();

    if (teamError || !team) {
      return new Response("Team not found", { status: 404 });
    }

    const { data: existing } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return new Response("User already in team", { status: 400 });
    }

    const { error: insertError } = await supabaseAdmin
      .from("team_members")
      .insert({
        user_id: user.id,
        team_id: team.id,
        role: "member",
      });

    if (insertError) {
      return new Response(insertError.message, { status: 500 });
    }

    return new Response(JSON.stringify(team), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
