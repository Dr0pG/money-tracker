import { StyleSheet, View } from "react-native";
import React from "react";
import Metrics from "@/constants/Metrics";
import Back from "@/components/Back";
import ThemedText from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

type PropTypes = {
  title: string;
};

const Header = ({ title }: PropTypes) => {
  const { t } = useTranslation();

  const router = useRouter();

  const onBack = () => router.back();

  return (
    <View style={styles.header}>
      <Back onPress={onBack} />
      <ThemedText style={styles.mainTitle} numberOfLines={2} type="title">
        {t(title)}
      </ThemedText>
      <View style={styles.rightWidth} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Metrics.largePadding,
    paddingTop: Metrics.smallPadding,
  },
  mainTitle: {
    flex: 1,
    paddingHorizontal: Metrics.mediumPadding,
    textAlign: "center",
  },
  rightWidth: { width: Metrics.backButtonSize },
});

export default Header;
