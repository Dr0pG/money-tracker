import User from "@/firebase/User";
import notifee, { AndroidImportance } from "@notifee/react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

const getToken = async () => {
  const token = await messaging().getToken();
  await User.storeFCMToken(token);
  // Save token to Firebase Database
};

const requestPermission = async () => {
  const authStatus =
    Platform.OS === "android"
      ? await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        )
      : await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL ||
    authStatus === "granted";

  if (enabled) getToken();
};

const displayNotification = async (
  remoteMessage?: FirebaseMessagingTypes.RemoteMessage
) => {
  if (!remoteMessage || !remoteMessage?.notification) return;

  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {
      channelId: "default",
    },
  });
};

const createChannel = async () => {
  await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
  });
};

export default {
  requestPermission,
  displayNotification,
  createChannel,
};
