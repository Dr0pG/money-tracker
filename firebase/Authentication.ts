import Toast from "@/components/Toast";
import Utils from "@/firebase/Utils";
import Keychain from "@/services/Keychain";
import userStore from "@/store/userStore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import i18n from "i18next";

/**
 * Function to login the user
 * @param email
 * @param password
 */
const loginUser = async (email: string, password: string) => {
  return auth()
    .signInWithEmailAndPassword(email, password)
    .then(async () => {
      Toast.showSuccess(i18n.t("login_successfully"));
      await Keychain.storeLogin(email, password);
    })
    .catch((error) => {
      let currentError = null;
      if (error.code === "auth/email-already-in-use") {
        currentError = i18n.t("that_email_address_is_already_in_use");
      }

      if (error.code === "auth/invalid-email") {
        currentError = i18n.t("that_email_address_is_invalid");
      }

      if (error.code === "auth/invalid-credential") {
        currentError = i18n.t(
          "the_supplied_authentication_credential_is_malformed_or_has_expired"
        );
      }

      return Promise.reject(currentError);
    });
};

/**
 * Function to register a new user
 * @param name
 * @param email
 * @param password
 */
const registerUser = async (name: string, email: string, password: string) => {
  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential: FirebaseAuthTypes.UserCredential) => {
      // Now update the user's profile with their name
      const currentUser = userCredential.user;
      currentUser.updateProfile({
        displayName: name, // Store the name in the displayName field
      });

      // Get the user ID (uid) from Firebase Authentication
      const userId = userCredential.user.uid;

      // Get current currency
      const currency = userStore.getState().currency;

      // Create the user object to store in the Realtime Database
      const user = {
        name: name,
        email: email,
        createdAt: new Date(),
        currency,
      };

      // Set the user object in the Realtime Database under a path like {userId}
      Utils.database()
        .ref(`/${userId}`)
        .set(user)
        .then(async () => {
          Toast.showSuccess(i18n.t("account_created_successfully"));
          await Keychain.storeLogin(email, password);
        })
        .catch(() => {
          const currentError = i18n.t(
            "there_was_a_problem_creating_your_account"
          );
          Toast.showError(currentError);

          return Promise.reject(currentError);
        });
    })
    .catch((error) => {
      let currentError = null;

      if (error.code === "auth/email-already-in-use") {
        currentError = i18n.t("that_email_address_is_already_in_use");
      }

      if (error.code === "auth/invalid-email") {
        currentError = i18n.t("that_email_address_is_invalid");
      }

      return Promise.reject(currentError);
    });
};

/**
 * Function to log out the user
 */
const signOut = () => {
  auth()
    .signOut()
    .then(async () => {
      await Keychain.resetLogin();
      Toast.showSuccess(i18n.t("user_logout_successfully"));
    })
    .catch(() => {
      Toast.showError(i18n.t("something_went_wrong"));
    });
};

export default { loginUser, registerUser, signOut };
