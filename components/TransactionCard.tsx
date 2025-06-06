import TouchableOpacity from "@/components/TouchableOpacity";
import Metrics from "@/constants/Metrics";
import React, { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";

import ThemedText from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getTypeColor, getTypeIcon } from "@/utils/getTypeInfo";

import userStore from "@/store/userStore";
import { TransactionCategory, TransactionType } from "@/store/walletStore";
import { formatEuropeanNumber } from "@/utils/Helpers";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

function RightAction(drag: SharedValue<number>, onDelete: () => void) {
  const [backgroundRed, iconColor] = useThemeColor({}, ["error", "text"]);

  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });

  return (
    <Animated.View style={styleAnimation}>
      <TouchableOpacity onPress={onDelete}>
        <View style={[styles.rightAction, { backgroundColor: backgroundRed }]}>
          <FontAwesome
            name="trash"
            size={Metrics.trashDeleteIcon}
            color={iconColor}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

type PropTypes = {
  id?: string;
  type: TransactionType;
  category?: TransactionCategory;
  description?: string;
  isIncome: boolean;
  value: number;
  date: string;
  onPress?: () => void;
  onDelete?: (id: string) => void;
};

const TransactionCard = ({
  id,
  type,
  category,
  description,
  isIncome = false,
  value,
  date,
  onPress,
  onDelete,
}: PropTypes) => {
  const { t } = useTranslation();

  const handleDelete = () => {
    if (onDelete && id) onDelete?.(id);
  };

  const { currency } = userStore();

  const [
    transactionCardsColor,
    transactionIconColor,
    infoGoodTextColor,
    infoBadTextColor,
  ] = useThemeColor({}, [
    "transactionCards",
    "transactionIcon",
    "green",
    "error",
  ]);

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
      case TransactionCategory.Rent:
      case TransactionCategory.Transportation:
      case TransactionCategory.Entertainment:
      case TransactionCategory.Personal:
      case TransactionCategory.Other:
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
      case TransactionCategory.Insurance:
        return (
          <Ionicons
            name={getTypeIcon(category)}
            size={Metrics.transactionIcon}
            color={transactionIconColor}
          />
        );
      case TransactionCategory.Investments:
        return (
          <FontAwesome5
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
  }, [isIncome, value, date, infoGoodTextColor, infoBadTextColor, currency]);

  const renderContent = () => {
    return (
      <TouchableOpacity
        style={[styles.container, { backgroundColor: transactionCardsColor }]}
        onPress={onPress}
        disabled={!onPress}
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
          <ThemedText type="medium">{t(category || type)}</ThemedText>
          {!!description && (
            <ThemedText
              type="gray"
              ellipsizeMode="tail"
              numberOfLines={1}
              style={styles.description}
            >
              {description}
            </ThemedText>
          )}
        </View>
        {renderRightInfo()}
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        {...(!!onDelete && {
          renderRightActions: (_, drag: SharedValue<number>) =>
            RightAction(drag, handleDelete),
        })}
      >
        {renderContent()}
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
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
  rightAction: {
    width: Metrics.trashSize,
    height: Metrics.mediumPadding * 2 + 40,
    borderRadius: Metrics.largeRadius,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(TransactionCard);
