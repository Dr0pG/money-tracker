import React, { memo, useState } from "react";
import { View, StyleSheet, LayoutChangeEvent, ViewStyle } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import ThemedText from "@/components/ThemedText";
import Metrics from "@/constants/Metrics";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import Durations from "@/constants/Durations";
import userStore from "@/store/userStore";

type InfoPropTypes = {
  type: "expense" | "income";
  value: number;
};

const Info = ({ type, value }: InfoPropTypes) => {
  const { t } = useTranslation();

  const { currency } = userStore();

  const blackTextColor = useThemeColor({}, "blackText");
  const backgroundColor = useThemeColor({}, "silver");

  const infoGoodTextColor = useThemeColor({}, "green");
  const infoBadTextColor = useThemeColor({}, "red");

  const isIncome = type === "income";
  return (
    <View>
      <View style={styles.infoTitle}>
        <View style={[styles.infoIconContainer, { backgroundColor }]}>
          <Ionicons
            name={isIncome ? "arrow-down" : "arrow-up"}
            size={Metrics.cardInfoIcon}
            color={blackTextColor}
          />
        </View>
        <ThemedText type="defaultSemiBold" color={blackTextColor}>
          {t(`${isIncome ? "home.income" : "home.expense"}`)}
        </ThemedText>
      </View>
      <ThemedText
        type="subtitle"
        color={isIncome ? infoGoodTextColor : infoBadTextColor}
      >
        {`${value === 0 ? "---" : value + currency}`}
      </ThemedText>
    </View>
  );
};

type PropTypes = {
  title?: string;
  value?: number;
  income?: number;
  expense?: number;
  style?: ViewStyle;
};

const MainCard = ({
  title = "",
  value = 0,
  income = 0,
  expense = 0,
  style = {},
}: PropTypes) => {
  const { t } = useTranslation();

  const { currency } = userStore();

  const mainCardBackground = useThemeColor({}, "mainCardBackground");
  const titleBackground = useThemeColor({}, "background");
  const blackTextColor = useThemeColor({}, "blackText");
  const platinum = useThemeColor({}, "platinum");

  const [cardHeight, setCardHeight] = useState(300);

  const cardWidth = Metrics.screenWidth - Metrics.largePadding * 2;

  const setOnLayout = (e: LayoutChangeEvent) => {
    setCardHeight(e.nativeEvent.layout.height);
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        { backgroundColor: mainCardBackground },
        style,
      ]}
      onLayout={setOnLayout}
      entering={FadeInDown.duration(Durations.animations).springify()}
      exiting={FadeOutDown.duration(Durations.animations).springify()}
    >
      <View style={styles.content}>
        {!!title && (
          <View
            style={[
              styles.titleHeader,
              {
                backgroundColor: titleBackground,
                borderColor: mainCardBackground,
              },
            ]}
          >
            <ThemedText type="subtitle" numberOfLines={1}>
              {title}
            </ThemedText>
          </View>
        )}
        <View style={styles.contentContainer}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle" color={blackTextColor}>
              {t("home.total_balance")}
            </ThemedText>
            <Entypo
              name="dots-three-horizontal"
              size={Metrics.cardDotsIcon}
              color={blackTextColor}
            />
          </View>
          <ThemedText
            type="bigTitle"
            style={styles.balanceText}
            color={blackTextColor}
          >
            {`${value + currency}`}
          </ThemedText>
          <View style={styles.cardInfo}>
            <Info type="income" value={income} />
            <Info type="expense" value={expense} />
          </View>
        </View>
      </View>
      <View
        style={[
          styles.backgroundEffect,
          {
            width: Metrics.screenWidth - Metrics.largePadding * 2,
            left: -(cardWidth / 4),
            height: cardHeight,
            top: -(cardHeight / 4),
            backgroundColor: platinum,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: Metrics.largeRadius,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
  },
  content: {
    zIndex: 1,
  },
  contentContainer: {
    paddingVertical: Metrics.mediumPadding,
    paddingHorizontal: Metrics.largePadding,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceText: {
    fontSize: Metrics.size32,
    lineHeight: Metrics.size32 * 1.3,
    fontWeight: "700",
  },
  cardInfo: {
    paddingTop: Metrics.mediumPadding,
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
  backgroundEffect: {
    position: "absolute",
    borderRadius: 100,
  },
  titleHeader: {
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
    borderTopLeftRadius: Metrics.largeRadius,
    borderTopRightRadius: Metrics.largeRadius,
    paddingVertical: Metrics.smallPadding,
    paddingHorizontal: Metrics.largePadding,
  },
});

export default memo(MainCard);
