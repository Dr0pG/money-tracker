import React, { memo } from "react";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

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
        <MainCard
          value={5000}
          income={2000}
          expense={950}
        />
        <View style={styles.recentTransactionsContainer}>
          <RecentTransactions />
        </View>
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
  helloText: {
    paddingVertical: Metrics.smallPadding,
    fontSize: Metrics.size22,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  mainContainer: {
    marginTop: Metrics.largeMargin,
  },
  mainContentContainer: {
    paddingBottom: Metrics.largeMargin,
  },
  recentTransactionsContainer: {
    marginTop: Metrics.largeMargin,
  },
});

export default memo(Home);
