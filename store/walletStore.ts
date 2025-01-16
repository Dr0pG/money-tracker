import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Wallet {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  transactions?: any[];
}

export type CreateWallet = {
  id?: string;
  name: string;
  description?: string;
  image?: string;
};

export type CreateWalletFirebase = {
  id: string;
  name: string;
  description?: string;
  image?: string;
};

interface WalletState {
  wallets: CreateWalletFirebase[];
  currentWallet: string | null;
  setCurrentWallet: (id?: string | null) => void;
  createWallet: (newWallet: CreateWalletFirebase) => void;
}

const walletStore = create<WalletState, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      wallets: [],
      currentWallet: null,
      createWallet: (newWallet: CreateWalletFirebase) =>
        set((state) => {
          return { ...state, wallets: [...state.wallets, newWallet] };
        }),
      setCurrentWallet: (id?: string | null) =>
        set((state) => ({ ...state, currentWallet: id })),
    }),
    {
      name: "wallets",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default walletStore;
