import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { supabase } from "../scripts/supabase";

// Configurar notificações quando o app está aberta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [loading, setLoading] = useState(true);

  // Verifica sessão inicial
  useEffect(() => {
    checkSession();

    // Listener para registrar token sempre que o usuário logar
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          console.log("Usuário logado, registrando token...");
          await registerForPush();
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
      setLoading(false);
      return;
    }

    if (session && inAuthGroup) {
      router.replace("/(tabs)");
      setLoading(false);
      return;
    }

    // Se houver sessão já ativa, registra token
    if (session) {
      await registerForPush();
    }

    setLoading(false);
  }

  async function registerForPush() {
    try {
      if (!Device.isDevice) {
        console.log("Push notifications só funcionam em dispositivos reais");
        return;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão de notificação não concedida");
        return;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
      if (!projectId) return;

      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Token do dispositivo:", token);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("Nenhum usuário logado, não é possível salvar token");
        return;
      }

      // Tenta inserir o token para este usuário
      const { error: insertError } = await supabase
        .from("t_notification_token")
        .insert({
          userId: user.id,
          expo_push_token: token,
          platform: Device.osName,
        });

      // Se já existir um registro para este userId, atualiza só ele
      if (insertError && insertError.code === "23505") {
        const { error: updateError } = await supabase
          .from("t_notification_token")
          .update({
            expo_push_token: token,
            platform: Device.osName,
          })
          .eq("userId", user.id); // ✅ atualiza só o userId atual

        if (updateError) console.log("Erro ao atualizar token:", updateError.message);
        else console.log("Token atualizado com sucesso!");
      } else if (!insertError) {
        console.log("Token inserido com sucesso!");
      }
    } catch (e) {
      console.log("Push registration error:", e);
    }
  }

  if (loading) return null;
  return <Slot />;
}
