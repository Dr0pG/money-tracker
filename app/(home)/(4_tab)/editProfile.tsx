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
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

const EditProfile = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const onBack = () => router.back();

  const nameInputRef = useRef<TextInput>(null);
  const currencyInputRef = useRef<TextInput>(null);

  const [backgroundColor, textColor] = useThemeColor({}, [
    "background",
    "text",
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
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const onUpdateProfile = () => {
    console.log("oi");
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
        <Image
          source={{ uri: state.image }}
          style={{ width: "100%", height: "100%" }}
        />
        <TouchableOpacity style={[styles.removeImage]} onPress={pickImage}>
          <Ionicons name="close-sharp" size={24} color={textColor} />
        </TouchableOpacity>
      </Animated.View>
    );
  }, [state?.image]);

  const renderForms = () => {
    return (
      <KeyboardAvoidingView style={styles.formContainer}>
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
        />
      </KeyboardAvoidingView>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Back onPress={onBack} />
        <ThemedText type="title">{t("profile.update_profile")}</ThemedText>
        <View style={styles.rightWidth} />
      </View>
    );
  };

  const renderButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <Button
          text={t("edit")}
          disabled={false}
          onPress={onUpdateProfile}
          isLoading={isLoading}
        />
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <View style={styles.emptyContent}>
          <Loader />
        </View>
      );

    return (
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {renderImage()}
        {renderForms()}
      </ScrollView>
    );
  };

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
    paddingTop: Metrics.mediumPadding,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightWidth: {
    width: Metrics.backButtonSize,
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
    overflow: "hidden",
    alignSelf: "center",
    marginTop: Metrics.largeMargin,
    ...Shadow.default,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: Metrics.largeRadius,
  },
  removeImage: {
    position: "absolute",
    top: Metrics.smallMargin,
    right: Metrics.smallMargin,
    width: Metrics.removeButton,
    height: Metrics.removeButton,
    borderRadius: Metrics.removeButton,
    alignItems: "center",
    justifyContent: "center",
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
