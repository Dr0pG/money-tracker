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
      <ScrollView style={styles.mainContainer}>
        <MainCard />
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
    paddingVertical: Metrics.mediumPadding,
  },
  helloText: {
    marginBottom: Metrics.smallMargin,
    fontSize: Metrics.subsize22,
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
});

export default memo(Home);
