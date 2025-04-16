import Back from "@/components/Back";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const onBack = () => router.back();

  const [backgroundColor, textColor] = useThemeColor({}, [
    "background",
    "text",
  ]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Back onPress={onBack} />
        <ThemedText type="title">{t("profile.privacy_policy")}</ThemedText>
        <View style={styles.rightWidth} />
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        style={{ backgroundColor }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.mainContent}
      >
        <ThemedText type="subtitle" style={styles.title}>
          {t("privacy_policy.title")}
        </ThemedText>
        <ThemedText>{t("privacy_policy.content")}</ThemedText>
      </ScrollView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      {renderContent()}
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
    paddingBottom: Metrics.largePadding,
  },
  rightWidth: {
    width: Metrics.backButtonSize,
  },
  mainContent: {
    paddingBottom: Metrics.largePadding * 2,
  },
  title: {
    paddingBottom: Metrics.largePadding,
  },
});

export default PrivacyPolicy;
