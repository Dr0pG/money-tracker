import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import ThemedText from "@/components/ThemedText";
import Back from "@/components/Back";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import UploadImage from "@/components/UploadImage";
import Button from "@/components/Button";

const CreateWallet = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const onBack = () => router.back();

  const nameInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [error, serError] = useState({
    name: "",
    description: "",
  });

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
        <Button text={t('create')} disabled={!name} />
      </View>
    );
  }, [name, description, image]);

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
