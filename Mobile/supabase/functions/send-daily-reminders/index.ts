import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    // Conectar com o Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Obter a data e hora exata para 1:45 AM do dia de hoje
    const currentDate = new Date();
    currentDate.setHours(2, 1, 0, 0); // Define para 1:55 AM

    // Verificando a data e hora formatada
    console.log("Data e Hora formatada:", currentDate.toISOString());

    // Formatar a data para o formato correto (YYYY-MM-DD)
    const formattedDate = currentDate.toISOString().split("T")[0]; // Pega a data no formato YYYY-MM-DD
    console.log("Data formatada:", formattedDate);

    // Buscar lembretes para o dia específico
    const { data: reminders, error: reminderError } = await supabase
      .from("v_reminder") // A view que você criou para pegar os lembretes
      .select("*")
      .eq("date", formattedDate);  // Filtra os lembretes pela data

    if (reminderError) {
      console.log("Erro ao buscar lembretes:", reminderError);
      return new Response("Erro ao buscar lembretes", { status: 500 });
    }

    if (!reminders || reminders.length === 0) {
      return new Response("Nenhum lembrete para enviar", { status: 200 });
    }

    // Agora buscamos os tokens de notificação para cada lembrete
    const userIds = reminders.map((r) => r.auth_userID); // Extrair userId dos lembretes

    const { data: tokens, error: tokenError } = await supabase
      .from("t_notification_token")
      .select("expo_push_token, userId") // Inclui o userId para associar com os lembretes
      .in("userId", userIds);

    if (tokenError) {
      console.log("Erro ao buscar tokens:", tokenError);
      return new Response("Erro ao buscar tokens", { status: 500 });
    }

    if (!tokens || tokens.length === 0) {
      return new Response("Nenhum token encontrado", { status: 200 });
    }

    // Cria uma lista de mensagens para enviar
    const messages: any[] = [];

    reminders.forEach((reminder) => {
      const userToken = tokens.find((token) => token.userId === reminder.auth_userID);
      if (userToken) {
        messages.push({
          to: userToken.expo_push_token,
          sound: "default",
          title: reminder.title,
          body: reminder.body,
        });
      }
    });

    if (messages.length === 0) {
      return new Response("Nenhuma mensagem para enviar", { status: 200 });
    }

    // Enviar as notificações
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });

    const respData = await response.json();
    console.log("Resposta da API Expo:", respData);

    return new Response(
      JSON.stringify({ success: true, respData }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.log("Erro no send-daily-reminders:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});

