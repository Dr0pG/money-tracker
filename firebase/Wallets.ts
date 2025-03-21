import Toast from "@/components/Toast";
import Utils from "@/firebase/Utils";
import { uploadImage } from "@/services/imagesService";
import { CreateWallet, Wallet } from "@/store/walletStore";
import { formatTotalTransactions } from "@/utils/TransationsHelper";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import i18n from "i18next";
import Transactions from "./Transactions";

/*
 * Function to create a new wallet
 * @param wallet
 * @returns formatted wallet or null
 */
const createWallet = async (wallet: CreateWallet): Promise<Wallet | null> => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return null;

  const newWallet = Utils.database().ref(`/${currentUser.uid}/wallets`).push();

  if (!newWallet.key) return null;

  let image: string = "";

  if (wallet?.image) image = await uploadImage("wallet", wallet.image);

  const formattedWallet: Wallet = {
    ...wallet,
    id: newWallet.key,
    image,
  };

  return newWallet
    .set(formattedWallet)
    .then(() => {
      Toast.showSuccess(i18n.t("create_wallet.wallet_created_successfully"));
      return formattedWallet;
    })
    .catch(() => {
      Toast.showSuccess(
        i18n.t("create_wallet.there_was_a_problem_creating_your_wallet")
      );
      return null;
    });
};

/**
 * Function to select the current Wallet (Path created in case user change device)
 * @param id
 * @returns
 */
const selectCurrentWallet = async (id: string) => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return null;

  await Utils.database().ref(`/${currentUser.uid}/currentWallet`).set(id);
};

/**
 * Function to get the current wallet selected by the user
 * @returns current wallet
 */
const getCurrentWallet = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return null;

  const currentWalletId = await getCurrentWalletId();
  if (!currentWalletId) return null;

  return Utils.database()
    .ref(`/${currentUser.uid}/wallets/${currentWalletId}`)
    .once("value")
    .then(async (snapshot) => {
      let currentWallet: Wallet | null = snapshot.val();
      if (!currentWallet) return null;

      currentWallet.transactions =
        (await Transactions.getTransactions()) || undefined;

      return formatTotalTransactions(currentWallet);
    });
};

/**
 * Function to get the current wallet id selected by the user
 * @returns id of the current wallet
 */
const getCurrentWalletId = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return null;

  return Utils.database()
    .ref(`/${currentUser.uid}/currentWallet`)
    .once("value")
    .then((snapshot) => {
      const currentWalletId: string | null = snapshot.val();
      return currentWalletId;
    });
};

/**
 * Function to get all the wallets of the user
 * @returns list of wallets
 */
const getWallets = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return;

  return Utils.database()
    .ref(`/${currentUser.uid}/wallets`)
    .once("value")
    .then((snapshot) => {
      const wallets = snapshot.val();

      const walletsArray = wallets
        ? Object.entries(wallets).map(([id, wallet]) => ({
            id,
            ...wallet,
          }))
        : [];

      const formatTransactions = walletsArray?.map((wallet) => {
        if (!wallet.transactions) return wallet;
        return {
          ...wallet,
          transactions:
            Object?.entries(wallet?.transactions).map(([id, transaction]) => ({
              id,
              ...transaction,
            })) || [],
        };
      });

      return formatTransactions;
    });
};

export default {
  createWallet,
  selectCurrentWallet,
  getCurrentWallet,
  getCurrentWalletId,
  getWallets,
};
