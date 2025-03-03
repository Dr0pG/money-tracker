import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export enum TransactionCategory {
  Health = "health",
  Income = "income",
  Utilities = "utilities",
  Dining = "dining",
  Clothing = "clothing",
  Groceries = "groceries",
  Sports = "sports",
  Rent = "rent",
  Transportation = "transportation",
  Entertainment = "entertainment",
  Insurance = "insurance",
  Personal = "personal",
  Investments = "investments",
  Other = "other",
}

export enum TransactionType {
  Expense = "expense",
  Income = "income",
}

export type Transaction = {
  walletId: string;
  type: TransactionType;
  category: TransactionCategory;
  date: Date;
  amount: number;
  description?: string;
  image?: string;
};

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
  transactions?: Transaction[];
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
      storeTransaction: (id: string, transaction: Transaction) =>
        set((state) => {
          return {
            wallets: state.wallets.map((wallet) =>
              wallet.id === id
                ? {
                    ...wallet,
                    transactions: [...(wallet.transactions ?? []), transaction],
                  }
                : wallet
            ),
          };
        }),
    }),
    {
      name: "wallets",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default walletStore;
