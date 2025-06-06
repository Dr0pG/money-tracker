import Header from "@/components/Header";
import RecentTransactions from "@/components/Home/RecentTransactions";
import Input from "@/components/Input";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

const SearchTransaction = () => {
  const { t } = useTranslation();

  const [searchTransaction, setSearchTransaction] = useState<string>("");

  const renderSearchInput = () => {
    return (
      <View style={styles.inputContent}>
        <Input
          icon="search"
          placeholder={t("search_transaction")}
          returnKeyType="next"
          value={searchTransaction}
          onChangeText={setSearchTransaction}
        />
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Metrics.largePadding,
        }}
      >
        <RecentTransactions search={searchTransaction} haveSearch />
      </ScrollView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Header title={"search"} />
      {renderSearchInput()}
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
  inputContent: {
    marginTop: Metrics.largeMargin,
  },
});

export default SearchTransaction;
