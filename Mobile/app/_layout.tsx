import { Slot } from "expo-router";
import { useEffect } from "react";
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
  useEffect(() => {
    registerForPush();
  }, []);

  async function registerForPush() {
    try {
      if (!Device.isDevice) {
        console.log("Must use physical device");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } =
          await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permission not granted");
        return;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        console.log("Missing EAS projectId");
        return;
      }

      const token = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      console.log("Expo push token:", token);

      // Buscar user logado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // if (!user) return;
      console.log("antes supabase")
      // Guardar token na Supabase
      await supabase.from("t_notification_token").upsert({
        user_id: "1",
        expo_push_token: token,
        platform: Device.osName,
        
      });
    } catch (e) {
      console.log("Push error:", e);
    }
  }

  return <Slot />;
}
