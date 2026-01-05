import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { supabase } from "../scripts/supabase";

// Configure notifications while app is open
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

  // Check auth session on app start
  useEffect(() => {
    checkSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          console.log("user login");
          await registerForPush();
        }
      }
    );

    // Remove listener on unmount
    return () => listener.subscription.unsubscribe();
  }, []);

  async function checkSession() {
    // Get current session
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

    if (session) {
      await registerForPush();
    }

    setLoading(false);
  }

  async function registerForPush() {
    try {
      if (!Device.isDevice) {
        console.log("Push notifications real phone");
        return;
      }

      // Request notification permission
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Push notifications only work on real devices");
        return;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
      if (!projectId) return;

      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Device token:", token);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("No logged user, cannot save token");
        return;
      }

      // Insert push token
      const { error: insertError } = await supabase
        .from("t_notification_token")
        .insert({
          userId: user.id,
          expo_push_token: token,
          platform: Device.osName,
        });

      // Update token if already exists
      if (insertError && insertError.code === "23505") {
        const { error: updateError } = await supabase
          .from("t_notification_token")
          .update({
            expo_push_token: token,
            platform: Device.osName,
          })
          .eq("userId", user.id); // Update current user only

        if (updateError) console.log("Error updating token:", updateError.message);
        else console.log("Token updated successfully");
      } else if (!insertError) {
        console.log("Token inserted successfully");
      }
    } catch (e) {
      console.log("Push registration error:", e);
    }
  }

  if (loading) return null;
  return <Slot />;
}
