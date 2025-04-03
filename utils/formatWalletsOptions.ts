import { DataType } from "@/components/DropDown";
import { Wallet } from "@/store/walletStore";

const formatWalletsOptions = (wallets: Wallet[]) => {
  const formattedWallets: DataType[] = [];

  if (!wallets?.length) return formattedWallets;

  wallets.map((wallet) => {
    const { id, name, income, expense } = wallet;
    if (!id) return;
    formattedWallets.push({
      value: id,
      label: `${name} (${(income ?? 0) - (expense ?? 0)})`,
    });
  });

  return formattedWallets;
};

const formatWalletOption = (wallet: Wallet) => {
  if (!wallet) return null;

  return {
    value: wallet.id,
    label: `${wallet.name} (${(wallet.income ?? 0) - (wallet.expense ?? 0)})`,
  };
};

export { formatWalletsOptions, formatWalletOption };
