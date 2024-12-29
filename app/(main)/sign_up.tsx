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
import { validateForm } from "@/utils/signUpFormValidation";
import Authentication from "@/firebase/Authentication";

const SignUp = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const onNavigateToSignIn = () => router.navigate("/sign_in");

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
    if (!validate.hasError) {
      Authentication.registerUser(name, email, password);
      return;
    }

    serError({
      name: t(validate?.errors?.name),
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
        <ThemedText type="extremeTitle">{t("sign_up.lets")}</ThemedText>
        <ThemedText type="extremeTitle">{t("sign_up.get_started")}</ThemedText>
        <ThemedText style={styles.descriptionText}>
          {t("sign_up.create_an_account")}
        </ThemedText>
      </View>
    );
  };

  const renderInputs = () => {
    return (
      <View style={styles.inputContainer}>
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
    return <Button text="sign_up.sign_up" onPress={onSubmit} />;
  };

  const renderAlreadyAccountText = () => {
    return (
      <View style={styles.alreadyAccountContainer}>
        <ThemedText>
          {t("sign_up.already_have_account")}
          <ThemedText type="hightLight" onPress={onNavigateToSignIn}>{` ${t(
            "login"
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
  alreadyAccountContainer: {
    marginTop: Metrics.largePadding,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(SignUp);
