import { create } from "zustand";

export type Settings = {
  transactions: {
    category: string;
    type: string;
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
