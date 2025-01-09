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

const Profile = () => {
  const { t } = useTranslation();

  return <ThemedView style={styles.container}></ThemedView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largePadding,
    paddingTop: Metrics.mediumPadding,
  },
});

export default memo(Profile);
