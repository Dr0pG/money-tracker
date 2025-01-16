import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { create } from "zustand";

type State = {
  user?: FirebaseAuthTypes.User | null;
  currency: string;
};

type Action = {
  storeUser: (currentUser: FirebaseAuthTypes.User | null) => void;
  setCurrency: (currency: string) => void;
  removeUser: () => void;
};

const userStore = create<State & Action>((set) => ({
  user: null,
  currency: "€",
  storeUser: (currentUser: FirebaseAuthTypes.User | null) =>
    set(() => ({ user: currentUser || null })),
  setCurrency: (currency: string) => set((state) => ({ ...state, currency })),
  removeUser: () => set(() => ({ user: null })),
}));

export default userStore;
