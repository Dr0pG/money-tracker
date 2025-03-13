import { StyleSheet, ViewStyle } from "react-native";
import React, { useCallback, useState } from "react";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import Metrics from "@/constants/Metrics";
import { useTranslation } from "react-i18next";
import Entypo from "@expo/vector-icons/Entypo";
import { useThemeColor } from "@/hooks/useThemeColor";

type PropTypes = {
  placeholder: string;
  style?: ViewStyle | ViewStyle[];
  wrapperStyle?: ViewStyle | ViewStyle[];
};

const DropDown = ({ placeholder, style, wrapperStyle }: PropTypes) => {
  const { t } = useTranslation();

  const color = useThemeColor({}, "text");

  const [selectedValue, setSelectedValue] = useState('');

  const renderTopPlaceholder = useCallback(() => {
    if (!placeholder) return;
    return (
      <ThemedText style={styles.placeholderText}>{t(placeholder)}</ThemedText>
    );
  }, [placeholder]);

  const renderSelectedOption = useCallback(() => {
    return (
      <ThemedText style={styles.placeholderText}>
        {selectedValue ?? t("select_item")}
      </ThemedText>
    );
  }, [selectedValue]);

  const renderIcon = () => {
    return (
      <Entypo name="chevron-down" size={Metrics.dropdownIcon} color={color} />
    );
  };

  return (
    <ThemedView style={[styles.container, style]}>
      {renderTopPlaceholder()}
      <ThemedView style={[styles.wrapper, wrapperStyle]}>
        {renderSelectedOption()}
        {renderIcon()}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Metrics.mediumMargin,
  },
  placeholderText: {
    marginBottom: Metrics.smallMargin,
    fontWeight: "bold",
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Metrics.largeRadius,
    paddingHorizontal: Metrics.mediumPadding,
    paddingVertical: Metrics.smallPadding,
  },
});

export default DropDown;
