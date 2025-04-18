import Back from "@/components/Back";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Loader from "@/components/Loader";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import TouchableOpacity from "@/components/TouchableOpacity";
import Durations from "@/constants/Durations";
import Metrics from "@/constants/Metrics";
import Shadow from "@/constants/Shadow";
import User from "@/firebase/User";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ErrorUpdateProfile } from "@/type/ErrorType";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { validateUpdateUserForm } from "@/utils/updateUserFormValidation";
import userStore from "@/store/userStore";
import Header from "@/components/Header";

const EditProfile = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const onBack = () => router.back();

  const storeUserInfo = userStore((state) => state.storeUserInfo);

  const nameInputRef = useRef<TextInput>(null);
  const currencyInputRef = useRef<TextInput>(null);

  const [textColor, button, buttonText] = useThemeColor({}, [
    "text",
    "button",
    "buttonText",
  ]);

  const [state, setState] = useState({
    name: "",
    image: "",
    currency: "",
    error: {
      name: "",
      currency: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingUserLoading, setIsUpdatingUserLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const user = await User.getUserInfo();

        if (!user?.name) return;

        setState((prevState) => ({
          ...prevState,
          name: user.name,
          image: user?.image,
          currency: user.currency,
        }));
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const onUpdateProfile = async () => {
    Keyboard.dismiss();
    try {
      const validate = validateUpdateUserForm(state.name, state.currency);
      if (!validate.hasError) {
        setIsUpdatingUserLoading(true);

        const { name, currency, image } = state;

        const updatedUser = await User.updateUserInfo({
          name,
          currency,
          image,
        });

        storeUserInfo({
          name: updatedUser?.name,
          image: updatedUser?.image,
          currency: updatedUser?.currency,
        });

        onBack();
        return;
      }

      setState((prevState) => ({
        ...prevState,
        error: {
          name: t(validate?.errors?.name),
          currency: t(validate?.errors?.currency),
        },
      }));
    } catch (error) {
      console.error("Error fetching updated user info:", error);
    } finally {
      setIsUpdatingUserLoading(false);
    }
  };

  const onChangeValue = (type: string, value: string) => {
    setState((prevState) => ({ ...prevState, [type]: value }));
  };

  const onError = (type: string, value: string) => {
    setState((prevState) => ({
      ...prevState,
      error: { ...prevState.error, [type]: value },
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (!result.canceled) {
      setState((prevState) => ({ ...prevState, image: result.assets[0].uri }));
    }
  };

  const renderImage = useCallback(() => {
    if (!state?.image)
      return (
        <TouchableOpacity
          style={[styles.uploadContainer, { borderColor: textColor }]}
          onPress={pickImage}
        >
          <MaterialIcons
            name="upload-file"
            size={Metrics.uploadImage}
            color={textColor}
            style={styles.icon}
          />
          <ThemedText>{t("upload_image")}</ThemedText>
        </TouchableOpacity>
      );

    return (
      <Animated.View
        style={styles.imageContainer}
        entering={FadeInDown.duration(Durations.animations).springify()}
        exiting={FadeOutDown.duration(Durations.animations).springify()}
      >
        <Image source={{ uri: state.image }} style={styles.image} />
        <TouchableOpacity
          style={[styles.updateImage, { backgroundColor: button }]}
          onPress={pickImage}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={Metrics.updateImageButton}
            color={buttonText}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }, [state?.image]);

  const renderForms = () => {
    return (
      <View style={styles.formContainer}>
        <Input
          ref={nameInputRef}
          topPlaceholder={t("profile.name")}
          placeholder={t("profile.name")}
          returnKeyType="next"
          isRequired
          value={state.name}
          onChangeText={(name: string) => onChangeValue("name", name)}
          hasError={state.error?.name !== ""}
          errorMessage={state.error?.name}
          onFocus={() => onError(ErrorUpdateProfile.Name, "")}
          onSubmitEditing={() => currencyInputRef.current?.focus()}
        />
        <View style={styles.divider} />
        <Input
          ref={currencyInputRef}
          topPlaceholder={t("profile.currency")}
          placeholder={t("profile.currency")}
          returnKeyType="done"
          isRequired
          value={state.currency}
          onChangeText={(currency: string) =>
            onChangeValue("currency", currency)
          }
          hasError={state.error?.currency !== ""}
          errorMessage={state.error?.currency}
          onFocus={() => onError(ErrorUpdateProfile.Currency, "")}
          onSubmitEditing={onUpdateProfile}
        />
      </View>
    );
  };

  const renderButton = useCallback(() => {
    return (
      <View style={styles.buttonContainer}>
        <Button
          text={t("edit")}
          disabled={!state.name || !state.currency}
          onPress={onUpdateProfile}
          isLoading={isLoading || isUpdatingUserLoading}
        />
      </View>
    );
  }, [isLoading, isUpdatingUserLoading, state.name, state.currency]);

  const renderContent = () => {
    if (isLoading)
      return (
        <View style={styles.emptyContent}>
          <Loader />
        </View>
      );

    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {renderImage()}
        {renderForms()}
      </KeyboardAwareScrollView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="profile.update_profile" />
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
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    padding: Metrics.largePadding,
    borderRadius: Metrics.mediumRadius,
    flexDirection: "row",
    marginTop: Metrics.largeMargin,
  },
  icon: {
    marginRight: Metrics.smallMargin,
  },
  imageContainer: {
    width: Metrics.imageSize,
    height: Metrics.imageSize,
    borderRadius: Metrics.imageSize,
    overflow: "visible",
    alignSelf: "center",
    marginTop: Metrics.largeMargin,
    ...Shadow.default,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: Metrics.imageSize,
  },
  updateImage: {
    position: "absolute",
    bottom: 0,
    right: Metrics.largePadding,
    width: Metrics.updateImageButton + Metrics.mediumPadding,
    height: Metrics.updateImageButton + Metrics.mediumPadding,
    borderRadius: Metrics.updateImageButton + Metrics.mediumPadding,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.default,
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

export default EditProfile;
