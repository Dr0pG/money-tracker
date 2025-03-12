import { View, StyleSheet, TextInput } from "react-native";
import React, { useReducer, useRef } from "react";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import ThemedText from "@/components/ThemedText";
import { useRouter } from "expo-router";
import Back from "@/components/Back";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "@/components/Input";
import { ErrorAddTransaction } from "@/type/ErrorType";
import { TransactionFields } from "@/store/walletStore";

const initialState = {
  type: "",
  wallet: "",
  category: "",
  date: new Date(),
  amount: 0,
  description: "",
  image: "",
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

  const amountInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const onBack = () => router.back();

  const onChangeValue = (type: TransactionFields, payload: string) => {
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
      >
        <Input
          ref={amountInputRef}
          topPlaceholder={t("create_wallet.description")}
          placeholder={t("create_wallet.description")}
          returnKeyType="next"
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

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      {renderContent()}
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
    paddingTop: Metrics.mediumPadding,
  },
});

export default AddTransaction;
