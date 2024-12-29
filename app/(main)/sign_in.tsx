import React, { memo, useRef, useState } from "react";

import ThemedView from "@/components/ThemedView";
import { StyleSheet, View } from "react-native";
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
import { validateForm } from "@/utils/signInFormValidation";
import Authentication from "@/firebase/Authentication";

const SignIn = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const onNavigateToSignUp = () => router.navigate("/sign_up");

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, serError] = useState({
    email: "",
    password: "",
  });

  const onSubmit = () => {
    const validate = validateForm(email, password);

    if (!validate.hasError) {
      Authentication.loginUser(email, password);
      return;
    }

    serError({
      email: t(validate?.errors?.email),
      password: t(validate?.errors?.password),
    });
  };

  const renderBackButton = () => {
    return <Back onPress={() => router.back()} />;
  };

  const renderTopText = () => {
    return (
      <View style={styles.topTextContainer}>
        <ThemedText type="extremeTitle">{t("sign_in.hey")},</ThemedText>
        <ThemedText type="extremeTitle">{t("sign_in.welcome_back")}</ThemedText>
        <ThemedText style={styles.descriptionText}>
          {t("sign_in.login_now_to_track_all_expenses")}
        </ThemedText>
      </View>
    );
  };

  const renderInputs = () => {
    return (
      <View style={styles.inputContainer}>
        <Input
          ref={emailInputRef}
          icon="email"
          placeholder={t("enter_your_email")}
          keyboardType="email-address"
          returnKeyType="next"
          value={email}
          onChangeText={(email: string) => setEmail(email.toLowerCase())}
          hasError={error.email !== ""}
          errorMessage={error.email}
          onFocus={() => serError({ ...error, email: "" })}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
        <Input
          ref={passwordInputRef}
          icon="password"
          placeholder={t("enter_your_password")}
          secureTextEntry
          returnKeyType="send"
          value={password}
          onChangeText={setPassword}
          hasError={error.password !== ""}
          errorMessage={error.password}
          onFocus={() => serError({ ...error, password: "" })}
          onSubmitEditing={onSubmit}
        />
      </View>
    );
  };

  const renderButton = () => {
    return <Button text="login" onPress={onSubmit} />;
  };

  const renderAlreadyAccountText = () => {
    return (
      <View style={styles.noAccountContainer}>
        <ThemedText>
          {t("sign_in.dont_have_an_account")}
          <ThemedText type="hightLight" onPress={onNavigateToSignUp}>{` ${t(
            "sign_in.sign_up"
          )}`}</ThemedText>
        </ThemedText>
      </View>
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
  noAccountContainer: {
    marginTop: Metrics.largePadding,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(SignIn);
