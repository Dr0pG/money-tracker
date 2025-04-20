import Toast from "@/components/Toast";
import Utils from "@/firebase/Utils";
import Wallets from "@/firebase/Wallets";
import i18n from "@/i18n";
import { uploadImage } from "@/services/imagesService";
import { UserInfo } from "@/store/userStore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

/**
 * Function to get user currency
 * @returns user info
 */
const getUserCurrency = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return;

  return Utils.database()
    .ref(`/${currentUser.uid}`)
    .once("value")
    .then((snapshot) => {
      const user = snapshot.val();
      return user.currency;
    });
};

/**
 * Function to get current user
 * @returns user
 */
const getUser = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return;

  return currentUser;
};

/**
 * Function to get user info
 * @returns user info
 */
const getUserInfo = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return;

  return Utils.database()
    .ref(`/${currentUser.uid}`)
    .once("value")
    .then((snapshot) => {
      const user = snapshot.val();
      return {
        name: user.name,
        image: user?.image,
        currency: user?.currency,
      };
    });
};

/**
 * Function to update user info
 * @returns user info
 */
const updateUserInfo = async (userInfo: UserInfo) => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return;

  const currentWallets = await Utils.database()
    .ref(`/${currentUser.uid}/wallets`)
    .once("value")
    .then((snapshot) => {
      const wallets = snapshot.val();
      return wallets;
    });

  const updatedUser = Utils.database().ref(`/${currentUser.uid}`);

  let image: string = "";

  if (userInfo?.image) image = await uploadImage("user", userInfo.image);

  const currentWalletId = await Wallets.getCurrentWalletId();

  const formattedUser = {
    ...userInfo,
    wallets: currentWallets,
    image,
    currentWallet: currentWalletId,
  };

  await currentUser.updateProfile({
    displayName: userInfo.name,
  });

  return updatedUser
    .set(formattedUser)
    .then(() => {
      Toast.showSuccess(i18n.t("profile.user_updated_successfully"));
      return formattedUser;
    })
    .catch(() => {
      Toast.showSuccess(
        i18n.t("profile.there_was_a_problem_updating_your_info")
      );
      return null;
    });
};

/**
 * Function to store FCM Token
 */
const storeFCMToken = async (fcmToken: string) => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return;

  return Utils.database().ref(`/${currentUser.uid}`).update({
    fcmToken,
  });
};

/**
 * Function to delete FCM Token
 */
const deleteFCMToken = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return;

  return Utils.database().ref(`/${currentUser.uid}`).update({
    fcmToken: null,
  });
};

export default {
  getUserCurrency,
  getUser,
  getUserInfo,
  updateUserInfo,
  storeFCMToken,
  deleteFCMToken,
};
