import Toast from "@/components/Toast";
import Utils from "@/firebase/Utils";
import Wallets from "@/firebase/Wallets";
import i18n from "@/i18n";
import { Transaction, TransactionForm } from "@/store/walletStore";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

/**
 * Function to create a new transaction into a wallet
 */
const createTransaction = async (transaction: TransactionForm) => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return null;

  const newTransaction = Utils.database()
    .ref(`/${currentUser.uid}/wallets/${transaction.wallet}/transactions`)
    .push();

  if (!newTransaction.key) return null;

  const formattedTransaction: Transaction = {
    id: newTransaction.key,
    type: transaction.type,
    wallet: transaction.wallet,
    category: transaction.category,
    date: transaction.date,
    amount: parseFloat(transaction.amount),
    description: transaction.description,
  };

  return newTransaction
    .set(formattedTransaction)
    .then(async () => {
      await Wallets.changeWalletValue(
        formattedTransaction.type,
        formattedTransaction.amount
      );

      Toast.showSuccess(
        i18n.t("create_transaction.transaction_created_successfully")
      );
      return formattedTransaction;
    })
    .catch(() => {
      Toast.showSuccess(
        i18n.t(
          "create_transaction.there_was_a_problem_creating_your_transaction"
        )
      );
      return null;
    });
};

/**
 * Function to get all transactions from the current wallet
 * @returns list of transactions
 */
const getTransactions = async () => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return null;

  const currentWallet = await Wallets.getCurrentWalletId();
  if (!currentWallet) return null;

  return Utils.database()
    .ref(`/${currentUser.uid}/wallets/${currentWallet}/transactions`)
    .once("value")
    .then((snapshot) => {
      const transactions = snapshot.val();

      const transactionsArray: Transaction[] | null = transactions
        ? Object.entries(transactions).map(([id, transaction]) => ({
            id,
            ...transaction,
          }))
        : [];

      const sortedTransactions =
        transactionsArray?.sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        ) || [];

      return sortedTransactions || [];
    });
};

export default {
  createTransaction,
  getTransactions,
};
