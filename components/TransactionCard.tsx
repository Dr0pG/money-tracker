import { View, StyleSheet } from "react-native";
import React, { memo, useCallback } from "react";
import Metrics from "@/constants/Metrics";
import TouchableOpacity from "@/components/TouchableOpacity";

import ThemedText from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getTypeIcon, TransactionType } from "@/utils/getTypeInfo";
import { getTypeColor } from "@/utils/getTypeInfo";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import userStore from "@/store/userStore";

type PropTypes = {
  type: TransactionType;
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
  const { currency } = userStore();

  const transactionCardsColor = useThemeColor({}, "transactionCards");
  const transactionIconColor = useThemeColor({}, "transactionIcon");

  const infoGoodTextColor = useThemeColor({}, "green");
  const infoBadTextColor = useThemeColor({}, "error");

  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

  const renderTypeIcon = () => {
    switch (type) {
      case TransactionType.health:
      case TransactionType.utilities:
      case TransactionType.groceries:
        return (
          <FontAwesome
            name={getTypeIcon(type)}
            size={Metrics.transactionIcon}
            color={transactionIconColor}
          />
        );
      case TransactionType.income:
        return (
          <MaterialIcons
            name={getTypeIcon(type)}
            size={Metrics.transactionIcon}
            color={transactionIconColor}
          />
        );
      case TransactionType.dining:
      case TransactionType.clothing:
      case TransactionType.sports:
        return (
          <MaterialCommunityIcons
            name={getTypeIcon(type)}
            size={Metrics.transactionIcon}
            color={transactionIconColor}
          />
        );
    }
  };

  const renderRightInfo = useCallback(() => {
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}`;
    return (
      <View style={styles.rightInfoContainer}>
        <ThemedText
          type="subtitle"
          color={isIncome ? infoGoodTextColor : infoBadTextColor}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {`${isIncome ? "+" : "-"} ${value}${currency}`}
        </ThemedText>
        <ThemedText type="gray" ellipsizeMode="tail">
          {formattedDate}
        </ThemedText>
      </View>
    );
  }, [isIncome, value, date, infoGoodTextColor, infoBadTextColor]);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: transactionCardsColor }]}
    >
      <View
        style={[styles.typeContainer, { backgroundColor: getTypeColor(type) }]}
      >
        {renderTypeIcon()}
      </View>
      <View style={styles.textInfoContainer}>
        <ThemedText type="medium">{formattedType}</ThemedText>
        <ThemedText
          type="gray"
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.description}
        >
          {description}
        </ThemedText>
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
    maxWidth: "50%",
    alignItems: "flex-end",
  },
  description: {
    fontSize: Metrics.size12,
    lineHeight: Metrics.size12 * 1.3,
  },
});

export default memo(TransactionCard);
