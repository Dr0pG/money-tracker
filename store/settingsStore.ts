import { create } from "zustand";
import { TransactionCategory, TransactionType } from "@/store/walletStore";

export type Settings = {
  transactions: {
    category: TransactionCategory;
    type: TransactionType;
  };
};

type State = {
  settings: Settings | null;
};

type Action = {
  storeSettings: (settings: Settings | null) => void;
};

const settingsStore = create<State & Action>((set) => ({
  settings: null,
  storeSettings: (settings: Settings | null) => set(() => ({ settings })),
}));

export default settingsStore;
