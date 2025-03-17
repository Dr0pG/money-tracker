import { DataType } from "@/components/DropDown";
import { Wallet } from "@/store/walletStore";

const formatWalletsOptions = (wallets: Wallet[]) => {
  const formattedWallets: DataType[] = [];

  if (!wallets?.length) return formattedWallets;

  wallets.map((wallet) => {
    const { id, name, total } = wallet;
    if (!id) return;
    formattedWallets.push({
      value: id,
      label: `${name} (${total})`,
    });
  });

  return formattedWallets;
};

export { formatWalletsOptions };

