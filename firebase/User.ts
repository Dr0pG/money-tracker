import Utils from "@/firebase/Utils";
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

export default {
  getUserCurrency,
};
