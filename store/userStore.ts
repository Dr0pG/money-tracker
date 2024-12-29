import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { create } from "zustand";

type State = {
  user?: FirebaseAuthTypes.User | null;
};

type Action = {
  storeUser: (currentUser: FirebaseAuthTypes.User | null) => void;
  removeUser: () => void;
};

// Create your store, which includes both state and (optionally) actions
const userStore = create<State & Action>((set) => ({
  user: null,
  storeUser: (currentUser: FirebaseAuthTypes.User | null) =>
    set(() => ({ user: currentUser || null })),
  removeUser: () => set(() => ({ user: null })),
}));

export default userStore;
