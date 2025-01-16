import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import Utils from "@/firebase/Utils";
import Toast from "@/components/Toast";
import i18n from "i18next";

/**
 * Function to login the user
 * @param email
 * @param password
 */
const loginUser = async (email: string, password: string) => {
  return auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      Toast.showSuccess(i18n.t("login_successfully"));
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

      // Create the user object to store in the Realtime Database
      const user = {
        name: name,
        email: email,
        createdAt: new Date(),
      };

      // Set the user object in the Realtime Database under a path like {userId}
      Utils.database()
        .ref(`/${userId}`)
        .set(user)
        .then(() => {
          Toast.showSuccess(i18n.t("account_created_successfully"));
        })
        .catch(() => {
          Toast.showError(i18n.t("there_was_a_problem_creating_your_account"));
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
    .then(() => {
      Toast.showSuccess(i18n.t("user_logout_successfully"));
    })
    .catch(() => {
      Toast.showError(i18n.t("something_went_wrong"));
    });
};

export default { loginUser, registerUser, signOut };
