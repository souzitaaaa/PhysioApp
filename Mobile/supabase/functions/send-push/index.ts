import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    const { userId, title, body } = await req.json();

    if (!title || !body) {
      return new Response("Dados incompletos", { status: 400 });
    }

    // Connect to Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Query push tokens
    let query = supabase
      .from("t_notification_token")
      .select("expo_push_token");

    if (userId) {
      query = query.eq("userId", userId);
    }

    const { data: tokens, error } = await query;

    if (error) {
      console.log("Erro ao buscar tokens:", error);
      return new Response("Erro ao buscar tokens", { status: 500 });
    }

    if (!tokens || tokens.length === 0) {
      return new Response("No tokens", { status: 200 });
    }

    // Prepare push messages
    const messages = tokens.map((t) => ({
      to: t.expo_push_token,
      sound: "default",
      title,
      body,
    }));

    // Send notifications via Expo
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });

    const respData = await response.json();

    return new Response(
      JSON.stringify({ success: true, respData }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.log("Erro no send-push:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
