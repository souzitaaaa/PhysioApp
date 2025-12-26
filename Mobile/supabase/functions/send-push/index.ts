import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    const { userId, title, body } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Buscar tokens do user
    const { data: tokens } = await supabase
      .from("t_notification_token")
      .select("expo_push_token")
      .eq("user_id", "1");

    if (!tokens || tokens.length === 0) {
      return new Response("No tokens", { status: 200 });
    }

    const messages = tokens.map((t) => ({
      to: t.expo_push_token,
      sound: "default",
      title,
      body,
    }));

    // Enviar para o servidor da Expo
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
    });
  }
});
