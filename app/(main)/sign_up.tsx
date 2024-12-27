import React, { memo, useRef, useState } from "react";

import ThemedView from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import Metrics from "@/constants/Metrics";
import { useTranslation } from "react-i18next";

import { useRouter } from "expo-router";
import Back from "@/components/Back";
import ThemedText from "@/components/ThemedText";
import Input from "@/components/Input";
import AnimatedThemedView from "@/components/AnimatedThemedView";
import Button from "@/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-gesture-handler";
import { validateForm } from "@/utils/formValidation";

const SignUp = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, serError] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = () => {
    const validate = validateForm(name, email, password);
    serError({
      name: t(validate?.name),
      email: t(validate?.email),
      password: t(validate?.password),
    });
  };

  const renderBackButton = () => {
    return <Back onPress={() => router.back()} />;
  };

  const renderTopText = () => {
    return (
      <ThemedView style={styles.topTextContainer}>
        <ThemedText type="extremeTitle">{t("sign_up.lets")}</ThemedText>
        <ThemedText type="extremeTitle">{t("sign_up.get_started")}</ThemedText>
        <ThemedText style={styles.descriptionText}>
          {t("sign_up.create_an_account")}
        </ThemedText>
      </ThemedView>
    );
  };

  const renderInputs = () => {
    return (
      <ThemedView style={styles.inputContainer}>
        <Input
          ref={nameInputRef}
          icon="name"
          placeholder={t("sign_up.enter_your_name")}
          returnKeyType="next"
          value={name}
          onChangeText={setName}
          hasError={error.name !== ""}
          errorMessage={error.name}
          onFocus={() => serError({ ...error, name: "" })}
          onSubmitEditing={() => emailInputRef.current?.focus()}
        />
        <Input
          ref={emailInputRef}
          icon="email"
          placeholder={t("sign_up.enter_your_email")}
          keyboardType="email-address"
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
          hasError={error.email !== ""}
          errorMessage={error.email}
          onFocus={() => serError({ ...error, email: "" })}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
        <Input
          ref={passwordInputRef}
          icon="password"
          placeholder={t("sign_up.enter_your_password")}
          secureTextEntry
          returnKeyType="send"
          value={password}
          onChangeText={setPassword}
          hasError={error.password !== ""}
          errorMessage={error.password}
          onFocus={() => serError({ ...error, password: "" })}
          onSubmitEditing={onSubmit}
        />
      </ThemedView>
    );
  };

  const renderButton = () => {
    return <Button text="sign_up.sign_up" onPress={onSubmit} />;
  };

  const renderAlreadyAccountText = () => {
    return (
      <ThemedView style={styles.alreadyAccountContainer}>
        <ThemedText>
          {t("sign_up.already_have_account")}
          <ThemedText type="hightLight" onPress={() => router.back()}>{` ${t(
            "sign_up.login"
          )}`}</ThemedText>
        </ThemedText>
      </ThemedView>
    );
  };

  const renderContent = () => {
    return (
      <AnimatedThemedView style={styles.contentContainer}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderTopText()}
          {renderInputs()}
          {renderButton()}
          {renderAlreadyAccountText()}
        </KeyboardAwareScrollView>
      </AnimatedThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {renderBackButton()}
      {renderContent()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingVertical: Metrics.mediumPadding,
  },
  contentContainer: {
    flex: 1,
    marginTop: Metrics.largeMargin,
  },
  topTextContainer: {
    marginTop: Metrics.largeMargin,
    paddingBottom: Metrics.mediumPadding,
  },
  descriptionText: {
    paddingTop: Metrics.largePadding,
  },
  inputContainer: {
    paddingVertical: Metrics.smallPadding,
  },
  alreadyAccountContainer: {
    marginTop: Metrics.mediumPadding * 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(SignUp);
