import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const { data: { user } } = await supabaseAdmin.auth.getUser(
    authHeader?.replace("Bearer ", ""),
  );
  if (!user) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single();

  if (!profile?.team_id) {
    return new Response("No team", { status: 403, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "10");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search");
  const created_by = url.searchParams.get("created_by");

  let query = supabaseAdmin
    .from("products")
    .select(
      `
      *,
      profiles (
        name
      )
    `,
      { count: "exact" },
    )
    .eq("team_id", profile.team_id)
    .neq("status", "Deleted");

  if (status && status !== "all") query = query.eq("status", status);
  if (created_by) query = query.eq("created_by", created_by);
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  const formattedData = data?.map((product) => {
    const { profiles, ...rest } = product;
    return {
      ...rest,
      created_by_name: profiles?.name ?? "Unknown",
    };
  });

  return new Response(
    JSON.stringify({
      data: formattedData,
      count,
      page,
      pageSize,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
