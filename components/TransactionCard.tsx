import TouchableOpacity from "@/components/TouchableOpacity";
import Metrics from "@/constants/Metrics";
import React, { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";

import ThemedText from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getTypeColor, getTypeIcon } from "@/utils/getTypeInfo";

import userStore from "@/store/userStore";
import { TransactionCategory, TransactionType } from "@/store/walletStore";
import { capitalizeFirstLetter, formatEuropeanNumber } from "@/utils/Helpers";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type PropTypes = {
  type: TransactionType;
  category?: TransactionCategory;
  description?: string;
  isIncome: boolean;
  value: number;
  date: string;
};

const TransactionCard = ({
  type,
  category,
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

  const formattedType = capitalizeFirstLetter(category || type);

  const renderTypeIcon = () => {
    if (type === TransactionType.Income) {
      return (
        <MaterialIcons
          name={getTypeIcon(type)}
          size={Metrics.transactionIcon}
          color={transactionIconColor}
        />
      );
    }

    switch (category) {
      case TransactionCategory.Health:
      case TransactionCategory.Utilities:
      case TransactionCategory.Groceries:
        return (
          <FontAwesome
            name={getTypeIcon(category)}
            size={Metrics.transactionIcon}
            color={transactionIconColor}
          />
        );
      case TransactionCategory.Dining:
      case TransactionCategory.Clothing:
      case TransactionCategory.Sports:
        return (
          <MaterialCommunityIcons
            name={getTypeIcon(category)}
            size={Metrics.transactionIcon}
            color={transactionIconColor}
          />
        );
    }
  };

  const renderRightInfo = useCallback(() => {
    const transactionDate = new Date(date);
    const formattedDate = `${transactionDate.getDate()} ${transactionDate.toLocaleString(
      "default",
      {
        month: "short",
      }
    )}`;

    return (
      <View style={styles.rightInfoContainer}>
        <ThemedText
          type="subtitle"
          color={isIncome ? infoGoodTextColor : infoBadTextColor}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {`${isIncome ? "+" : "-"} ${formatEuropeanNumber(value)}${currency}`}
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
        style={[
          styles.typeContainer,
          { backgroundColor: getTypeColor(category || type) },
        ]}
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
