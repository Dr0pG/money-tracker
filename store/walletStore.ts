import { create } from "zustand";

export enum TransactionCategory {
  Health = "health",
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
}

export type TransactionForm = {
  type: TransactionType;
  wallet: string;
  category?: TransactionCategory;
  date: string;
  amount: string;
  description?: string;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  wallet: string;
  category?: TransactionCategory;
  date: string;
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
  expense: number;
  income: number;
  transactions?: Transaction[];
};

type WalletState = {
  wallets: Wallet[];
  currentWallet: string | null;
};

type WalletAction = {
  createWallet: (newWallet: Wallet) => void;
  setWallets: (wallets?: Wallet[] | null) => void;
  setCurrentWallet: (id?: string | null) => void;
  storeTransaction: (transaction: Transaction) => void;
};

const walletStore = create<WalletState & WalletAction>((set) => ({
  wallets: [],
  currentWallet: null,
  createWallet: (newWallet: Wallet) =>
    set((state) => {
      const currentWallets = [...state.wallets];
      currentWallets.push(newWallet);
      return { ...state, wallets: currentWallets };
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
  storeTransaction: (transaction: Transaction) =>
    set((state) => {
      return {
        ...state,
        wallets: state.wallets.map((wallet) =>
          wallet.id === transaction.wallet
            ? {
                ...wallet,
                transactions: [...(wallet?.transactions ?? []), transaction],
              }
            : wallet
        ),
      };
    }),
}));

export default walletStore;
