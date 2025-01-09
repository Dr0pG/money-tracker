import React, { memo } from "react";

import LottieView from "lottie-react-native";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { StyleSheet, View } from "react-native";
import Metrics from "@/constants/Metrics";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import { useThemeColor } from "@/hooks/useThemeColor";
import Button from "@/components/Button";
import TouchableOpacity from "@/components/TouchableOpacity";
import AnimatedThemedView from "@/components/AnimatedThemedView";
import { useRouter } from "expo-router";

const Intro = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");
  const gradient = useThemeColor({}, "gradient");

  const onNavigateToSignUp = () => router.navigate("/sign_up");
  const onNavigateToSignIn = () => router.navigate("/sign_in");

  const renderSignIn = () => {
    return (
      <View style={styles.signInContainer}>
        <TouchableOpacity onPress={onNavigateToSignIn}>
          <ThemedText type="subtitle" animationType="fade">
            {t("main.sign_in")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAnimation = () => {
    return (
      <LottieView
        source={require("@/assets/lottie/money.json")}
        style={styles.animationContent}
        autoPlay
        loop
      />
    );
  };

  const renderTopContent = () => {
    return (
      <LinearGradient
        colors={[backgroundColor, `rgba(${gradient}, 0.2)`]}
        locations={[0.97, 1]}
        style={styles.topContainer}
      >
        {renderSignIn()}
        {renderAnimation()}
      </LinearGradient>
    );
  };

  const renderIntroText = () => {
    return (
      <View style={styles.introTextContainer}>
        <ThemedText type="title" style={styles.titleInfo}>
          {t("main.always_take_control")}
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.subtitleInfo}>
          {t("main.finances_must_be")}
        </ThemedText>
      </View>
    );
  };

  const renderButton = () => {
    return <Button text="main.get_started" onPress={onNavigateToSignUp} />;
  };

  const renderBottomContent = () => {
    return (
      <AnimatedThemedView style={styles.bottomContainer}>
        {renderIntroText()}
        {renderButton()}
      </AnimatedThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {renderTopContent()}
      {renderBottomContent()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Metrics.mediumPadding,
  },
  topContainer: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingVertical: Metrics.mediumPadding,
  },
  bottomContainer: {
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.mediumPadding * 2,
    paddingBottom: Metrics.mediumPadding,
  },
  signInContainer: {
    position: "absolute",
    top: Metrics.mediumPadding,
    right: Metrics.largePadding,
    zIndex: 1,
  },
  animationContent: {
    flex: 2,
    width: "100%",
    height: "100%",
  },
  introTextContainer: {
    paddingBottom: Metrics.largePadding,
  },
  titleInfo: {
    textAlign: "center",
  },
  subtitleInfo: {
    paddingTop: Metrics.mediumPadding,
    textAlign: "center",
    fontWeight: "400",
  },
});

export default memo(Intro);
