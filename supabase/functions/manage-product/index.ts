import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
    authHeader.replace("Bearer ", ""),
  );

  if (authError || !user) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single();

  const teamId = profile?.team_id;
  if (!teamId) {
    return new Response("User has no team", {
      status: 403,
      headers: corsHeaders,
    });
  }

  const { action, id, payload } = await req.json();

  try {
    if (action === "create") {
      const { data, error } = await supabaseAdmin.from("products").insert({
        ...payload,
        team_id: teamId,
        created_by: user.id,
      }).select().single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const { data: product, error: fetchError } = await supabaseAdmin
        .from("products")
        .select("status, team_id")
        .eq("id", id)
        .single();

      if (fetchError || product?.team_id !== teamId) {
        return new Response("Not found or access denied", {
          status: 404,
          headers: corsHeaders,
        });
      }

      if (product.status === "Active") {
        return new Response("Forbidden: Cannot edit active product", {
          status: 403,
          headers: corsHeaders,
        });
      }

      const { data, error } = await supabaseAdmin.from("products").update(
        payload,
      )
        .eq("id", id)
        .select().single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const { error } = await supabaseAdmin.from("products").update({
        status: "Deleted",
      })
        .eq("id", id)
        .eq("team_id", teamId);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders },
      });
    }

    return new Response("Invalid action", {
      status: 400,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(err.message, { status: 500, headers: corsHeaders });
  }
});
