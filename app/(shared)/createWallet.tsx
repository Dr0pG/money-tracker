import Back from "@/components/Back";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Toast from "@/components/Toast";
import UploadImage from "@/components/UploadImage";
import Metrics from "@/constants/Metrics";
import Wallets from "@/firebase/Wallets";
import walletStore from "@/store/walletStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import i18n from "i18next";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateWallet = () => {
  const { t } = useTranslation();

  const { wallet } = useLocalSearchParams();

  const {
    currentWalletId,
    createWallet,
    setCurrentWallet,
    setCurrentWalletId,
  } = walletStore();

  const router = useRouter();

  const onBack = () => router.back();

  const nameInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const currentSelectedWallet = !!wallet ? JSON.parse(wallet as string) : "";

  const [name, setName] = useState<string>(currentSelectedWallet?.name || "");
  const [description, setDescription] = useState<string>(
    currentSelectedWallet?.description || ""
  );
  const [image, setImage] = useState<string>(
    currentSelectedWallet?.image || ""
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, serError] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });

  const onCreateWallet = async () => {
    setIsLoading(true);
    try {
      const newWallet = { name, description, image };
      const response = !!currentSelectedWallet
        ? await Wallets.updateWallet({ ...currentSelectedWallet, ...newWallet })
        : await Wallets.createWallet(newWallet);

      if (response) {
        createWallet(response);
        if (!currentWalletId) {
          await Wallets.selectCurrentWallet(response.id);
          setCurrentWallet(response);
          setCurrentWalletId(response.id);
        }
        onBack();
      }
    } catch (error) {
      Toast.showError(
        i18n.t("create_wallet.there_was_a_problem_creating_your_wallet")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.formContainer}
      >
        <Input
          ref={nameInputRef}
          topPlaceholder={`${t("create_wallet.name")}*`}
          placeholder={t("create_wallet.name")}
          returnKeyType="next"
          value={name}
          onChangeText={setName}
          hasError={error.name !== ""}
          errorMessage={error.name}
          onFocus={() => serError({ ...error, name: "" })}
          onSubmitEditing={() => descriptionInputRef.current?.focus()}
        />
        <View style={styles.divider} />
        <Input
          ref={descriptionInputRef}
          topPlaceholder={t("create_wallet.description")}
          placeholder={t("create_wallet.description")}
          returnKeyType="next"
          value={description}
          onChangeText={setDescription}
          hasError={error.description !== ""}
          errorMessage={error.description}
          onFocus={() => serError({ ...error, description: "" })}
        />
        <View style={styles.divider} />
        <UploadImage
          title={t("create_wallet.image")}
          imageUrl={image}
          onImagePicked={setImage}
          onRemoveImage={() => setImage("")}
        />
      </KeyboardAwareScrollView>
    );
  };

  const renderButton = useCallback(() => {
    return (
      <View style={styles.buttonContainer}>
        <Button
          text={t(!!currentSelectedWallet ? "edit" : "create")}
          disabled={!name}
          onPress={onCreateWallet}
          isLoading={isLoading}
        />
      </View>
    );
  }, [currentSelectedWallet, name, description, image, isLoading]);

  const renderHeader = useCallback(() => {
    return (
      <Header
        title={
          !!currentSelectedWallet
            ? "create_wallet.edit_wallet"
            : "create_wallet.title"
        }
      />
    );
  }, [currentSelectedWallet]);

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
  formContainer: { marginTop: Metrics.largePadding },
  divider: { height: Metrics.mediumMargin },
  buttonContainer: { paddingVertical: Metrics.mediumPadding },
});

export default CreateWallet;
