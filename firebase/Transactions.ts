import Toast from "@/components/Toast";
import Utils from "@/firebase/Utils";
import Wallets from "@/firebase/Wallets";
import i18n from "@/i18n";
import {
  Transaction,
  TransactionForm,
  TransactionType,
} from "@/store/walletStore";
import { EventEmitterHelper, EventName } from "@/utils/EventEmitter";
import { parseEuropeanNumber, transformObjectIntoArray } from "@/utils/Helpers";
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
    date: transaction.date,
    amount: parseEuropeanNumber(transaction.amount),
    description: transaction.description,
    ...(transaction.type === TransactionType.Expense && {
      category: transaction.category,
    }),
  };

  return newTransaction
    .set(formattedTransaction)
    .then(async () => {
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

  const currentWalletId = await Wallets.getCurrentWalletId();
  if (!currentWalletId) return null;

  return Utils.database()
    .ref(`/${currentUser.uid}/wallets/${currentWalletId}/transactions`)
    .once("value")
    .then((snapshot) => {
      const transactions = snapshot.val();

      const transactionsArray: Transaction[] | null =
        transformObjectIntoArray(transactions);

      const sortedTransactions =
        transactionsArray?.sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        ) || [];

      return sortedTransactions || [];
    });
};

/**
 * Function to delete selected transaction
 */
const deleteTransaction = async (id: string) => {
  const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;
  if (!currentUser) return null;

  const currentWalletId = await Wallets.getCurrentWalletId();
  if (!currentWalletId) return null;

  return Utils.database()
    .ref(`/${currentUser.uid}/wallets/${currentWalletId}/transactions/${id}`)
    .remove()
    .then(() => {
      EventEmitterHelper.emit(EventName.UpdateTransactions);
      Toast.showSuccess(
        i18n.t("delete_transaction.transaction_deleted_successfully")
      );
    })
    .catch(() => {
      Toast.showSuccess(
        i18n.t(
          "delete_transaction.there_was_a_problem_deleting_your_transaction"
        )
      );
    });
};

export default {
  createTransaction,
  getTransactions,
  deleteTransaction,
};
