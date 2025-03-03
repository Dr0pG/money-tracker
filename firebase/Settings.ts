import Utils from "@/firebase/Utils";

/**
 * Function to get settings for app
 * @returns settings value
 */
const getSettings = async () => {
  return Utils.database()
    .ref(`/settings`)
    .once("value")
    .then((snapshot) => {
      const settings = snapshot.val();
      return settings;
    });
};

export default {
  getSettings,
};
