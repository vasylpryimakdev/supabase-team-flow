import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, teamCode } = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!email || !teamCode) {
      throw new Error("Email and team code are required");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Team App <noreply@yourdomain.com>",
        to: [email],
        subject: "You've been invited to join a team!",
        html: `
          <h1>You've been invited!</h1>
          <p>You have been invited to join a team. Click the link below to accept the invitation:</p>
          <a href="https://your-app.com/join?code=${teamCode}">Join the team</a>
          <p>Or you can simply enter this code manually: <strong>${teamCode}</strong></p>
          <br>
          <p>Best regards,<br>The Team App Team</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error
      ? e.message
      : "An unknown error occurred";

    console.error("Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
