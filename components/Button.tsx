import { ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import React from "react";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedText from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import TouchableOpacity from "@/components/TouchableOpacity";

type PropTypes = {
  style?: ViewStyle | ViewStyle[];
  text: string;
  isUpperCase?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
};

const Button = ({
  style = {},
  text,
  isUpperCase = true,
  isLoading = false,
  onPress = () => {},
}: PropTypes) => {
  const { t } = useTranslation();

  const backgroundColor = useThemeColor({}, "button");
  const textColor = useThemeColor({}, "buttonText");

  const translatedText = t(text);
  const currentText = isUpperCase
    ? translatedText.toUpperCase()
    : translatedText;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor },
        ...(Array.isArray(style) ? style : [style]),
      ]}
      onPress={onPress}
    >
      {!isLoading && <ThemedText type="bigButton">{currentText}</ThemedText>}
      {isLoading && <ActivityIndicator color={textColor} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Metrics.heightButton,
    padding: Metrics.mediumPadding,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Metrics.largeRadius,
  },
});

export default Button;
