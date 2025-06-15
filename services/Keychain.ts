import i18n from "@/i18n";
import * as Keychain from "react-native-keychain";

const storeLogin = async (email: string, password: string) => {
  try {
    await Keychain.setGenericPassword(email, password, {
      service: "login",
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      authenticationPrompt: {
        title: i18n.t("authenticate_to_login"),
      },
    });
  } catch (error) {
    console.log("Error: storeLogin, ", error);
  }
};

const getLogin = async () => {
  try {
    // Retrieve the credentials
    const credentials = await Keychain.getGenericPassword({
      service: "login",
    });
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );

      return credentials;
    } else {
      console.log("No credentials stored");
    }
  } catch (error) {
    console.error("Failed to access Keychain", error);
  }
};

const resetLogin = async () => {
  try {
    await Keychain.resetGenericPassword({ service: "login" });
  } catch (error) {
    console.log("Error: resetLogin, ", error);
  }
};

export default { getLogin, resetLogin, storeLogin };
