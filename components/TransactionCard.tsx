import { View, StyleSheet } from "react-native";
import React, { memo, useCallback } from "react";
import Metrics from "@/constants/Metrics";
import TouchableOpacity from "@/components/TouchableOpacity";

import Ionicons from "@expo/vector-icons/Ionicons";
import ThemedText from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

type PropTypes = {
  type: string;
  description?: string;
  isIncome: boolean;
  value: number;
  date: Date;
};

const TransactionCard = ({
  type,
  description,
  isIncome = false,
  value,
  date,
}: PropTypes) => {
  const infoGoodTextColor = useThemeColor({}, "green");
  const infoBadTextColor = useThemeColor({}, "error");

  const renderRightInfo = useCallback(() => {
    return (
      <View style={styles.rightInfoContainer}>
        <ThemedText
          type="subtitle"
          color={isIncome ? infoGoodTextColor : infoBadTextColor}
        >
          {`${isIncome ? "+" : "-"} ${value}€`}
        </ThemedText>
        <ThemedText ellipsizeMode="tail">{`${date.getDate()}`}</ThemedText>
      </View>
    );
  }, [isIncome, value, date, infoGoodTextColor, infoBadTextColor]);

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.typeContainer}>
        <Ionicons name="heart" size={24} color={"white"} />
      </View>
      <View style={styles.textInfoContainer}>
        <ThemedText type="medium">{type}</ThemedText>
        <ThemedText type="gray">{description}</ThemedText>
      </View>
      {renderRightInfo()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    padding: Metrics.mediumPadding,
    borderRadius: Metrics.largeRadius,
    marginBottom: Metrics.mediumMargin,
    flexDirection: "row",
    alignItems: "center",
  },
  typeContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: Metrics.mediumRadius,
    backgroundColor: "red",
  },
  textInfoContainer: {
    flex: 1,
    paddingHorizontal: Metrics.mediumPadding,
  },
  rightInfoContainer: {
    alignItems: "flex-end",
  },
});

export default memo(TransactionCard);
