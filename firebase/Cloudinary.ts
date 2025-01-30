import Utils from "@/firebase/Utils";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

/**
 * Function to get cloudinary url
 * @returns url of cloudinary
 */
const getCloudinaryUrl = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return null;

  return Utils.database()
    .ref(`/cloudinary_url`)
    .once("value")
    .then((snapshot) => {
      const url = snapshot.val();
      return url;
    });
};

export default {
  getCloudinaryUrl,
};
