import { StyleSheet, View } from "react-native";
import React from "react";
import ThemedText from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import Metrics from "@/constants/Metrics";
import MainCard from "@/components/MainCard";

const WalletPreview = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{t("preview")}</ThemedText>
      <View style={styles.mainCardContainer}>
        <MainCard income={0} expense={0} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Metrics.mediumMargin,
  },
  title: {
    marginBottom: Metrics.smallMargin,
    fontWeight: "bold",
  },
  mainCardContainer: {
    paddingTop: Metrics.smallPadding,
  },
});

export default WalletPreview;
