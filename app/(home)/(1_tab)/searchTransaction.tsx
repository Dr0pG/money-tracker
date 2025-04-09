import Back from "@/components/Back";
import RecentTransactions from "@/components/Home/RecentTransactions";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const SearchTransaction = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const onBack = () => router.back();

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Back onPress={onBack} />
        <ThemedText type="title">{t("search")}</ThemedText>
        <View style={styles.rightWidth} />
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Metrics.largePadding,
        }}
      >
        <RecentTransactions />
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
  mainContent: {
    marginTop: Metrics.largeMargin,
  },
});

export default SearchTransaction;
