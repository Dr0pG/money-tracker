import Back from "@/components/Back";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const Settings = () => {
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
        <ThemedText type="title">{t("profile.settings")}</ThemedText>
        <View style={styles.rightWidth} />
      </View>
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <ThemedView style={styles.container}>{renderHeader()}</ThemedView>
    </ScrollView>
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
});

export default Settings;
