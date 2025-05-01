import Header from "@/components/Header";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const backgroundColor = useThemeColor({}, "background");

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
      <Header title="profile.privacy_policy" />
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
  mainContent: {
    flexGrow: 1,
    paddingBottom: Metrics.largePadding * 2,
  },
  title: {
    paddingBottom: Metrics.largePadding,
  },
});

export default PrivacyPolicy;
