import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import Utils from "@/firebase/Utils";

const loginUser = (email: string, password: string) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log("User account created & signed in!");
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
      }

      if (error.code === "auth/invalid-email") {
        console.log("That email address is invalid!");
      }

      console.error(error);
    });
};

const registerUser = (name: string, email: string, password: string) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential: FirebaseAuthTypes.UserCredential) => {
      console.log("User account created & signed in!");

      // Now update the user's profile with their name
      const currentUser = userCredential.user;
      currentUser
        .updateProfile({
          displayName: name, // Store the name in the displayName field
        })
        .then(() => {
          console.log("User profile updated with name:", name);
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
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
          console.log("User data saved in Realtime Database");
        })
        .catch((error) => {
          console.error("Error saving user data:", error);
        });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
      }

      if (error.code === "auth/invalid-email") {
        console.log("That email address is invalid!");
      }

      console.error(error);
    });
};

const signOut = () => {
  auth()
    .signOut()
    .then(() => {
      console.log("User logout successfully");
    })
    .catch((error) => {
      console.error("Error login out the user:", error);
    });
};

export default { loginUser, registerUser, signOut };
