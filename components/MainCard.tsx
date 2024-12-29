import React, { memo } from "react";
import { View, StyleSheet } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import ThemedText from "@/components/ThemedText";
import Metrics from "@/constants/Metrics";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "@/hooks/useThemeColor";

type InfoPropTypes = {
  type: "expense" | "income";
  value: number;
};

const Info = ({ type, value }: InfoPropTypes) => {
  const backgroundColor = useThemeColor({}, "backButtonBackground");

  const infoGoodTextColor = useThemeColor({}, "green");
  const infoBadTextColor = useThemeColor({}, "error");

  const isIncome = type === "income";
  return (
    <View>
      <View style={styles.infoTitle}>
        <View style={[styles.infoIconContainer, { backgroundColor }]}>
          <Ionicons
            name={isIncome ? "arrow-down" : "arrow-up"}
            size={Metrics.cardInfoIcon}
            color="black"
          />
        </View>
        <ThemedText>{isIncome ? "Income" : "Expense"}</ThemedText>
      </View>
      <ThemedText
        style={{ color: isIncome ? infoGoodTextColor : infoBadTextColor }}
      >
        {value}€
      </ThemedText>
    </View>
  );
};

const MainCard = () => {
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.cardContainer}>
      <View style={styles.content}>
        <View style={styles.cardHeader}>
          <ThemedText type="subtitle">Total Balanced</ThemedText>
          <Entypo
            name="dots-three-horizontal"
            size={Metrics.cardDotsIcon}
            color={textColor}
          />
        </View>
        <ThemedText type="bigTitle" style={styles.balanceText}>
          334€
        </ThemedText>
        <View style={styles.cardInfo}>
          <Info type="income" value={3123} />
          <Info type="expense" value={100} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: Metrics.largePadding,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  content: {
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Metrics.mediumPadding,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: "700",
  },
  cardInfo: {
    paddingTop: Metrics.largePadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoTitle: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Metrics.smallPadding,
  },
  infoIconContainer: {
    width: Metrics.cardInfoSize,
    height: Metrics.cardInfoSize,
    borderRadius: Metrics.cardInfoSize,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Metrics.smallMargin,
  },
});

export default memo(MainCard);
