import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// helper: generate invite code
function generateInviteCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");

    // 1. get user from JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const teamName = body.name;

    if (!teamName) {
      return new Response(JSON.stringify({ error: "Team name required" }), {
        status: 400,
      });
    }

    // 2. generate invite code
    const inviteCode = generateInviteCode();

    // 3. create team
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: teamName,
        invite_code: inviteCode,
      })
      .select()
      .single();

    if (teamError) {
      return new Response(JSON.stringify(teamError), { status: 500 });
    }

    // 4. add member
    const { error: memberError } = await supabase
      .from("team_members")
      .insert({
        user_id: user.id,
        team_id: team.id,
        role: "owner",
      });

    if (memberError) {
      return new Response(JSON.stringify(memberError), { status: 500 });
    }

    // 5. return result
    return new Response(
      JSON.stringify({
        team,
        inviteCode,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});