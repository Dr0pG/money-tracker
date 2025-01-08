import React, { memo } from "react";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import AntDesign from "@expo/vector-icons/AntDesign";

import Metrics from "@/constants/Metrics";
import userStore from "@/store/userStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "@/hooks/useThemeColor";
import TouchableOpacity from "@/components/TouchableOpacity";
import MainCard from "@/components/MainCard";
import RecentTransactions from "@/components/Home/RecentTransactions";
import Authentication from "@/firebase/Authentication";

const Home = () => {
  const { t } = useTranslation();

  const currentUser = userStore((state) => state.user);

  const iconColor = useThemeColor({}, "icon");

  const addTransactionIconColor = useThemeColor({}, "buttonText");
  const addTransactionBackgroundColor = useThemeColor({}, "button");

  const iconBackgroundColor = useThemeColor({}, "backButtonBackground");

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.nameContainer}>
          <ThemedText type="gray" style={styles.helloText}>
            {t("home.hello")}
          </ThemedText>
          <ThemedText type="bigTitle" numberOfLines={1} ellipsizeMode="tail">
            {currentUser?.displayName}
          </ThemedText>
        </View>
        <View style={styles.searchIconContainer}>
          <TouchableOpacity
            style={[
              styles.searchIconContent,
              { backgroundColor: iconBackgroundColor },
            ]}
            onPress={Authentication.signOut}
          >
            <Ionicons
              name="search"
              size={Metrics.searchIcon}
              color={iconColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <MainCard value={0} income={0} expense={0} />
        <View style={styles.recentTransactionsContainer}>
          <RecentTransactions />
        </View>
      </ScrollView>
    );
  };

  const renderAddTransaction = () => {
    return (
      <View style={styles.addTransactionContainer}>
        <TouchableOpacity
          style={[
            styles.addTransactionContent,
            { backgroundColor: addTransactionBackgroundColor },
          ]}
        >
          <AntDesign
            name="plus"
            size={Metrics.addTransactionIcon}
            color={addTransactionIconColor}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      {renderContent()}
      {renderAddTransaction()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.mediumPadding,
  },
  helloText: {
    paddingVertical: Metrics.smallPadding,
    fontSize: Metrics.size22,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: Metrics.smallPadding,
  },
  nameContainer: {
    flex: 1,
  },
  searchIconContainer: {
    alignItems: "flex-end",
    marginLeft: Metrics.mediumMargin,
  },
  searchIconContent: {
    width: Metrics.searchButtonSize,
    height: Metrics.searchButtonSize,
    borderRadius: Metrics.searchButtonSize,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {},
  mainContentContainer: {
    marginTop: Metrics.mediumMargin,
    paddingBottom: Metrics.largeMargin + Metrics.addTransactionButton,
  },
  recentTransactionsContainer: {
    marginTop: Metrics.largeMargin,
  },
  addTransactionContainer: {
    position: "absolute",
    bottom: Metrics.largePadding,
    right: Metrics.largePadding,
    alignItems: "center",
    justifyContent: "center",
  },
  addTransactionContent: {
    width: Metrics.addTransactionButton,
    height: Metrics.addTransactionButton,
    borderRadius: Metrics.addTransactionButton,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(Home);
