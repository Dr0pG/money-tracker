import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";

const getToken = async () => {
  //const token = await messaging().getToken();
  //console.log("FCM Token:", token);
  // Save token to Firebase Database
};

const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

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
