import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import ThemedText from "@/components/ThemedText";
import { useRouter } from "expo-router";
import Back from "@/components/Back";
import { useTranslation } from "react-i18next";

const AddTransaction = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const onBack = () => router.back();

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Back onPress={onBack} />
        <ThemedText type="title">{t("create_transaction.title")}</ThemedText>
        <View style={styles.rightWidth} />
      </View>
    );
  };

  return <ThemedView style={styles.container}>{renderHeader()}</ThemedView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.largePadding,
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

export default AddTransaction;
