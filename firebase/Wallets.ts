import Toast from "@/components/Toast";
import Utils from "@/firebase/Utils";
import { uploadImage } from "@/services/imagesService";
import { CreateWallet, Wallet } from "@/store/walletStore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import i18n from "i18next";

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
    total: 0,
    expense: 0,
    income: 0,
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

  await Utils.database()
    .ref(`/${currentUser.uid}/wallets/currentWallet`)
    .set(id);
};

/**
 * Function to get the current wallet selected by the user
 * @returns id of the current wallet
 */
const getCurrentWallet = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return null;

  return Utils.database()
    .ref(`/${currentUser.uid}/wallets/currentWallet`)
    .once("value")
    .then((snapshot) => {
      const currentWallet: string | null = snapshot.val();
      return currentWallet;
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
      const walletsArray = wallets ? Object.values(wallets) : [];
      return walletsArray;
    });
};

export default {
  createWallet,
  selectCurrentWallet,
  getCurrentWallet,
  getWallets,
};
