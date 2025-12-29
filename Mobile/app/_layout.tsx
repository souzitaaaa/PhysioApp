import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { supabase } from "../scripts/supabase";

// 👉 Como as notificações aparecem quando a app está aberta
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

  useEffect(() => {
    checkSession();
    registerForPush();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    }

    if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }

    setLoading(false);
  }

  async function registerForPush() {
    try {
      if (!Device.isDevice) return;

      const { status } =
        await Notifications.requestPermissionsAsync();

      if (status !== "granted") return;

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) return;

      const token = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.from("t_notification_token").upsert({
        user_id: user.id,
        expo_push_token: token,
        platform: Device.osName,
      });
    } catch (e) {
      console.log("Push error:", e);
    }
  }

  if (loading) return null;

  return <Slot />;
}
