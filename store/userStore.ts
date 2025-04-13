import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { create } from "zustand";

export type UserInfo = {
  name?: string;
  currency?: string;
  image?: string;
};

type State = {
  user?: FirebaseAuthTypes.User | null;
  currency: string;
  image: string | null;
};

type Action = {
  storeUser: (currentUser: FirebaseAuthTypes.User | null) => void;
  storeUserInfo: (userInfo: UserInfo | null) => void;
  setCurrency: (currency: string) => void;
  removeUser: () => void;
};

const userStore = create<State & Action>((set) => ({
  user: null,
  currency: "€",
  image: "",
  storeUser: (currentUser: FirebaseAuthTypes.User | null) =>
    set(() => ({ user: currentUser || null })),
  storeUserInfo: (userInfo: UserInfo | null) =>
    set((state) => ({
      ...state,
      currency: userInfo?.currency,
      image: userInfo?.image,
    })),
  setCurrency: (currency: string) => set((state) => ({ ...state, currency })),
  removeUser: () => set(() => ({ user: null })),
}));

export default userStore;
