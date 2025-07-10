import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import DropDown from "@/components/DropDown";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ThemedView from "@/components/ThemedView";
import Toast from "@/components/Toast";
import Metrics from "@/constants/Metrics";
import Transactions from "@/firebase/Transactions";
import i18n from "@/i18n";
import settingsStore from "@/store/settingsStore";
import walletStore, {
  Transaction,
  TransactionFields,
  TransactionType,
  Wallet,
} from "@/store/walletStore";
import { ErrorAddTransaction } from "@/type/ErrorType";
import { EventEmitterHelper, EventName } from "@/utils/EventEmitter";
import {
  formatWalletOption,
  formatWalletsOptions,
} from "@/utils/formatWalletsOptions";
import { splitStringIntoArray } from "@/utils/Helpers";
import { isFormValidated, validateForm } from "@/utils/TransactionsHelper";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const initialState = {
  type: "",
  wallet: "",
  category: "",
  date: new Date(),
  amount: 0,
  description: "",
  error: {
    type: "",
    wallet: "",
    category: "",
    date: "",
    amount: "",
    description: "",
  },
};

const reducer = (state: any, action: any) => {
  if (action.type === "load_values") {
    return {
      ...state,
      ...action.payload,
    };
  }

  return { ...state, [action.type]: action.payload };
};

const AddTransaction = () => {
  const { t } = useTranslation();

  const { transaction } = useLocalSearchParams();

  const router = useRouter();

  const datePickerRef = useRef(null);
  const amountInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentSelectedTransaction = !!transaction
    ? JSON.parse(transaction as string)
    : "";

  const [state, dispatch] = useReducer(reducer, initialState);

  const { wallets, storeTransaction } = walletStore();
  const { settings } = settingsStore();

  useEffect(() => {
    if (currentSelectedTransaction) {
      dispatch({
        type: "load_values",
        payload: currentSelectedTransaction,
      });
    }
  }, []);

  const onCreateTransaction = async () => {
    Keyboard.dismiss();

    setIsLoading(true);

    try {
      dispatch({
        type: "error",
        payload: {
          type: "",
          wallet: "",
          category: "",
          date: "",
          amount: "",
          description: "",
        },
      });

      const validate = validateForm(state);

      if (validate.hasError) {
        Toast.showError(
          i18n.t(
            "create_transaction.there_was_a_problem_creating_your_transaction"
          )
        );
        setIsLoading(false);
        return;
      }

      const response: Transaction | null = currentSelectedTransaction
        ? await Transactions.updateTransaction(state)
        : await Transactions.createTransaction(state);

      if (response) {
        EventEmitterHelper.emit(EventName.UpdateTransactions);

        storeTransaction(response);
        onBack();
      }
    } catch (error) {
      Toast.showError(
        i18n.t(
          "create_transaction.there_was_a_problem_creating_your_transaction"
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onBack = () => router.back();

  const onChangeValue = (
    type: TransactionFields,
    payload: string | number | Date
  ) => {
    dispatch({ type, payload });
  };

  const onError = (type: ErrorAddTransaction, payload: string) => {
    dispatch({ type: "error", payload: { ...state.error, [type]: payload } });
  };

  const renderContent = () => {
    const selectedWallet =
      wallets?.find((wallet: Wallet) => wallet.id === state?.wallet) || null;

    return (
      <View style={styles.formContainer}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <DropDown
            key={TransactionFields.Type}
            placeholder={t("create_transaction.type")}
            value={state.type}
            isRequired
            options={splitStringIntoArray(settings?.transactions?.type)}
            onChangeValue={(value: string) =>
              onChangeValue(TransactionFields.Type, value)
            }
          />
          <View style={styles.divider} />
          {!currentSelectedTransaction?.wallet && (
            <>
              <DropDown
                key={TransactionFields.Wallet}
                placeholder={t("create_transaction.wallet")}
                value={state.wallet}
                isRequired
                options={formatWalletsOptions(wallets)}
                onChangeValue={(value: string) =>
                  onChangeValue(TransactionFields.Wallet, value)
                }
                {...(selectedWallet && {
                  label: formatWalletOption(selectedWallet)?.label,
                })}
              />
              <View style={styles.divider} />
            </>
          )}
          {state.type === TransactionType.Expense && (
            <>
              <DropDown
                key={TransactionFields.Category}
                placeholder={t("create_transaction.expense_category")}
                value={state.category}
                isRequired
                options={splitStringIntoArray(settings?.transactions?.category)}
                onChangeValue={(value: string) =>
                  onChangeValue(TransactionFields.Category, value)
                }
              />
              <View style={styles.divider} />
            </>
          )}
          <DatePicker
            ref={datePickerRef}
            key={TransactionFields.Date}
            placeholder={t("create_transaction.date")}
            value={state.date}
            isRequired
            onChangeValue={(value: string) =>
              onChangeValue(TransactionFields.Date, value)
            }
          />
          <View style={styles.divider} />
          <Input
            ref={amountInputRef}
            topPlaceholder={t("create_transaction.amount")}
            placeholder={t("create_transaction.amount")}
            returnKeyType="next"
            keyboardType="numeric"
            isRequired
            value={state.amount?.toString() || ""}
            onChangeText={(amount: string) =>
              onChangeValue(TransactionFields.Amount, amount)
            }
            hasError={state.error.amount !== ""}
            errorMessage={state.error.amount}
            onFocus={() => onError(ErrorAddTransaction.Amount, "")}
            onSubmitEditing={() => descriptionInputRef.current?.focus()}
          />
          <View style={styles.divider} />
          <Input
            ref={descriptionInputRef}
            topPlaceholder={t("create_transaction.description")}
            placeholder={t("create_transaction.description")}
            returnKeyType="send"
            isBigInput
            value={state.description?.toString()}
            onChangeText={(description: string) =>
              onChangeValue(TransactionFields.Description, description)
            }
            hasError={state.error.description !== ""}
            errorMessage={state.error.description}
            onFocus={() => onError(ErrorAddTransaction.Description, "")}
            onSubmitEditing={onCreateTransaction}
          />
          <View style={styles.divider} />
        </KeyboardAwareScrollView>
      </View>
    );
  };

  const renderButton = useCallback(() => {
    return (
      <View style={styles.buttonContainer}>
        <Button
          text={t(!!currentSelectedTransaction ? "edit" : "create")}
          disabled={!isFormValidated(state)}
          onPress={onCreateTransaction}
          isLoading={isLoading}
        />
      </View>
    );
  }, [currentSelectedTransaction, state, isLoading]);

  const renderHeader = useCallback(() => {
    return (
      <Header
        title={
          !!currentSelectedTransaction
            ? "create_transaction.edit_transaction"
            : "create_transaction.title"
        }
      />
    );
  }, [currentSelectedTransaction]);

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.largePadding,
    paddingBottom: Metrics.mediumPadding,
  },
  formContainer: {
    flex: 1,
    marginTop: Metrics.largePadding,
  },
  divider: {
    height: Metrics.mediumMargin,
  },
  buttonContainer: {
    paddingVertical: Metrics.mediumPadding,
  },
});

export default AddTransaction;
