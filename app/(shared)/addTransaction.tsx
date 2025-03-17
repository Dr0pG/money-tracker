import Back from "@/components/Back";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import DropDown from "@/components/DropDown";
import Input from "@/components/Input";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import settingsStore from "@/store/settingsStore";
import walletStore, {
  TransactionFields,
  TransactionType,
} from "@/store/walletStore";
import { ErrorAddTransaction } from "@/type/ErrorType";
import { formatWalletsOptions } from "@/utils/formatWalletsOptions";
import { splitStringIntoArray } from "@/utils/Helpers";
import { isFormValidated, validateForm } from "@/utils/TransationsHelper";
import { useRouter } from "expo-router";
import React, { useCallback, useReducer, useRef, useState } from "react";
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
  return { ...state, [action.type]: action.payload };
};

const AddTransaction = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const datePickerRef = useRef(null);
  const amountInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const { wallets } = walletStore();
  const { settings } = settingsStore();

  const onCreateTransaction = () => {
    Keyboard.dismiss();

    dispatch({ type: "error", payload: {} });

    const validate = validateForm(state);

    console.log("validate: ", validate);
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
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.formContainer}
        nestedScrollEnabled
      >
        <DropDown
          key={TransactionFields.Type}
          placeholder={t("create_transaction.type")}
          isRequired
          options={splitStringIntoArray(settings?.transactions?.type)}
          onChangeValue={(value: string) =>
            onChangeValue(TransactionFields.Type, value)
          }
        />
        <View style={styles.divider} />
        <DropDown
          key={TransactionFields.Wallet}
          placeholder={t("create_transaction.wallet")}
          isRequired
          options={formatWalletsOptions(wallets)}
          onChangeValue={(value: string) =>
            onChangeValue(TransactionFields.Wallet, value)
          }
        />
        <View style={styles.divider} />
        {state.type === TransactionType.Expense && (
          <>
            <DropDown
              key={TransactionFields.Category}
              placeholder={t("create_transaction.expense_category")}
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
          value={state.amount}
          onChangeText={(amount: string) =>
            onChangeValue(TransactionFields.Amount, parseFloat(amount))
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
          returnKeyType="next"
          isBigInput
          value={state.description}
          onChangeText={(description: string) =>
            onChangeValue(TransactionFields.Description, description)
          }
          hasError={state.error.description !== ""}
          errorMessage={state.error.description}
          onFocus={() => onError(ErrorAddTransaction.Description, "")}
        />
        <View style={styles.divider} />
      </KeyboardAwareScrollView>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Back onPress={onBack} />
        <ThemedText type="title">{t("create_transaction.title")}</ThemedText>
        <View style={styles.rightWidth} />
      </View>
    );
  };

  const renderButton = useCallback(() => {
    return (
      <View style={styles.buttonContainer}>
        <Button
          text={t("create")}
          disabled={!isFormValidated(state)}
          onPress={onCreateTransaction}
          isLoading={isLoading}
        />
      </View>
    );
  }, [state, isLoading]);

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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightWidth: {
    width: Metrics.backButtonSize,
  },
  formContainer: {
    marginTop: Metrics.largePadding + Metrics.smallPadding,
  },
  divider: {
    height: Metrics.mediumMargin,
  },
  buttonContainer: {
    paddingVertical: Metrics.mediumPadding,
  },
});

export default AddTransaction;
