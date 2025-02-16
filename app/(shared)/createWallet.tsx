import { StyleSheet, TextInput, View } from "react-native";
import Back from "@/components/Back";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Toast from "@/components/Toast";
import UploadImage from "@/components/UploadImage";
import Metrics from "@/constants/Metrics";
import Wallets from "@/firebase/Wallets";
import walletStore from "@/store/walletStore";
import { useRouter } from "expo-router";
import i18n from "i18next";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateWallet = () => {
  const { t } = useTranslation();

  const { currentWallet, createWallet, setCurrentWallet } = walletStore();

  const router = useRouter();

  const onBack = () => router.back();

  const nameInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, serError] = useState({
    name: "",
    description: "",
  });

  const onCreateWallet = async () => {
    setIsLoading(true);
    try {
      const newWallet = { name, description, image };
      const response = await Wallets.createWallet(newWallet);
      if (response) {
        createWallet(response);
        if (!currentWallet) {
          await Wallets.selectCurrentWallet(response.id);
          setCurrentWallet(response.id);
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

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Back onPress={onBack} />
        <ThemedText type="title">{t("create_wallet.title")}</ThemedText>
        <View style={styles.rightWidth} />
      </View>
    );
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
          text={t("create")}
          disabled={!name}
          onPress={onCreateWallet}
          isLoading={isLoading}
        />
      </View>
    );
  }, [name, description, image, isLoading]);

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
    paddingBottom: Metrics.largePadding + Metrics.smallPadding,
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

export default CreateWallet;
