import { Wallet } from "@/store/walletStore";

const formatWalletsOptions = (wallets: Wallet[]) => {
  const formattedWallets: string[] = [];

  if (!wallets?.length) return formattedWallets;

  wallets.map((wallet) => {
    const { id, name, total } = wallet;
    if (!id) return;
    formattedWallets.push(`${name} (${total})`);
  });

  return formattedWallets;
};

export { formatWalletsOptions };

