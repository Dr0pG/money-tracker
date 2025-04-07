import React, { memo, useCallback } from "react";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import TouchableOpacity from "@/components/TouchableOpacity";
import Durations from "@/constants/Durations";
import Metrics from "@/constants/Metrics";
import Authentication from "@/firebase/Authentication";
import { useThemeColor } from "@/hooks/useThemeColor";
import userStore from "@/store/userStore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

type Option = {
  icon: React.ReactNode;
  name: string;
  backgroundColor: string;
  animationsDelay?: number;
  onPress: () => void;
};

const Option = ({
  icon,
  name,
  backgroundColor,
  animationsDelay = Durations.animationsDelay - 400,
  onPress,
}: Option) => {
  const textColor = useThemeColor({}, "text");

  return (
    <Animated.View
      style={styles.optionContainer}
      entering={FadeInDown.duration(Durations.animations)
        .delay(animationsDelay)
        .springify()}
      exiting={FadeOutDown.duration(Durations.animations)
        .delay(animationsDelay)
        .springify()}
    >
      <TouchableOpacity style={styles.optionContent} onPress={onPress}>
        <View style={styles.optionLeftContent}>
          <View style={[styles.iconContainer, { backgroundColor }]}>
            {icon}
          </View>
          <ThemedText style={styles.optionName}>{name}</ThemedText>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={Metrics.profileIcons}
          color={textColor}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const Profile = () => {
  const { t } = useTranslation();

  const [backgroundColor, textColor] = useThemeColor({}, [
    "background",
    "text",
  ]);

  const { user, image } = userStore();

  const onLogOut = () => {
    Alert.alert(
      t("profile.log_out"),
      t("profile.are_you_sure_you_want_to_logout"),
      [
        {
          text: t("cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: t("logout"), onPress: Authentication.signOut },
      ]
    );
  };

  const renderTitle = () => {
    return (
      <View style={styles.titleContainer}>
        <ThemedText type="title">{t("profile.title")}</ThemedText>
      </View>
    );
  };

  const renderUserImage = useCallback(() => {
    return (
      <Animated.View
        style={styles.imageContainer}
        entering={FadeInDown.duration(Durations.animations).springify()}
        exiting={FadeOutDown.duration(Durations.animations).springify()}
      >
        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
        />
      </Animated.View>
    );
  }, [image]);

  const renderUserInfo = useCallback(() => {
    return (
      <Animated.View
        style={styles.userInfoContainer}
        entering={FadeInDown.duration(Durations.animations).springify()}
        exiting={FadeOutDown.duration(Durations.animations).springify()}
      >
        <ThemedText style={styles.name}>{user?.displayName}</ThemedText>
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
      </Animated.View>
    );
  }, [user?.displayName, user?.email]);

  const renderOption = () => {
    return (
      <View style={styles.optionsContainer}>
        <Option
          icon={
            <FontAwesome5
              name={"user-alt"}
              size={Metrics.profileIcons}
              color={textColor}
            />
          }
          name={t("profile.edit_profile")}
          backgroundColor={"blue"}
          onPress={() => console.log("Edit profile")}
        />
        <Option
          icon={
            <Ionicons
              name="settings-sharp"
              size={Metrics.profileIcons}
              color={textColor}
            />
          }
          name={t("profile.settings")}
          backgroundColor={"green"}
          animationsDelay={Durations.animationsDelay - 300}
          onPress={() => console.log("Settings")}
        />
        <Option
          icon={
            <FontAwesome5
              name="shopping-bag"
              size={Metrics.profileIcons}
              color={textColor}
            />
          }
          name={t("profile.privacy_policy")}
          backgroundColor={"orange"}
          animationsDelay={Durations.animationsDelay - 200}
          onPress={() => console.log("Privacy Policy")}
        />
        <Option
          icon={
            <FontAwesome5
              name="power-off"
              size={Metrics.profileIcons}
              color={textColor}
            />
          }
          name={t("profile.log_out")}
          backgroundColor={"red"}
          animationsDelay={Durations.animationsDelay - 100}
          onPress={onLogOut}
        />
      </View>
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <ThemedView style={styles.container}>
        {renderTitle()}
        {renderUserImage()}
        {renderUserInfo()}
        {renderOption()}
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.mediumPadding,
  },
  titleContainer: {
    alignItems: "center",
  },
  imageContainer: {
    paddingTop: Metrics.largePadding * 2,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Metrics.profileImage,
    height: Metrics.profileImage,
    borderRadius: Metrics.profileImage,
  },
  userInfoContainer: {
    paddingTop: Metrics.mediumPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: Metrics.size24,
    lineHeight: Metrics.size24 * 1.3,
    fontWeight: "bold",
  },
  email: {
    paddingTop: Metrics.smallPadding / 2,
  },
  optionsContainer: {
    paddingTop: Metrics.largePadding * 2,
  },
  optionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Metrics.mediumMargin,
  },
  optionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionLeftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: Metrics.profileIconsBackgroundSize,
    height: Metrics.profileIconsBackgroundSize,
    borderRadius: Metrics.largeRadius,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Metrics.mediumMargin,
  },
  optionName: {
    fontSize: Metrics.size18,
    lineHeight: Metrics.size18 * 1.3,
    fontWeight: "600",
  },
});

export default memo(Profile);
