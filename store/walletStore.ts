import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export enum TransactionFields {
  Type = "type",
  Wallet = "wallet",
  Category = "category",
  Date = "date",
  Amount = "amount",
  Description = "description",
  Image = "image",
};

export type TransactionForm = {
  type: TransactionType;
  wallet: string;
  category?: TransactionCategory;
  date: string;
  amount: string;
  description?: string;
};

export type Transaction = {
  type: TransactionType;
  walletId: string;
  category: TransactionCategory;
  date: Date;
  amount: number;
  description?: string;
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
  createWallet: (newWallet: Wallet) => void;
  setWallets: (wallets?: Wallet[] | null) => void;
  setCurrentWallet: (id?: string | null) => void;
  storeTransaction: (id: string, transaction: Transaction) => void;
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
      setWallets: (wallets?: Wallet[] | null) =>
        set((state) => {
          return {
            ...state,
            wallets: wallets || [],
            currentWallet: !!wallets?.length ? state.currentWallet : null,
          };
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
                    transactions: [
                      ...(wallet?.transactions ?? []),
                      transaction,
                    ],
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
