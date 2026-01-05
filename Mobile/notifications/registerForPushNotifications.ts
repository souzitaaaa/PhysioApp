import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Register device for push notifications
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    throw new Error('Must use physical device for Push Notifications');
  }

  // Check existing permission
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  // Request permission if not granted
  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Notification permission not granted');
  }

  // Get Expo projectId
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error('Expo projectId not found');
  }

  // Get push token
  const token = (
    await Notifications.getExpoPushTokenAsync({ projectId })
  ).data;

  return token;
}
