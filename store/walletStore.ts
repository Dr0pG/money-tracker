import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type CreateWallet = {
  id?: string;
  name: string;
  description?: string;
  image?: string;
};

export type Wallet = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  total: number;
  expense: number;
  income: number;
  transactions?: any[];
};

interface WalletState {
  wallets: Wallet[];
  currentWallet: string | null;
  setCurrentWallet: (id?: string | null) => void;
  createWallet: (newWallet: Wallet) => void;
}

const walletStore = create<WalletState, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      wallets: [],
      currentWallet: null,
      createWallet: (newWallet: Wallet) =>
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
