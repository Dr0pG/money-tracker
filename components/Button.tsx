import { StyleSheet, ViewStyle } from "react-native";
import React from "react";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedText from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import TouchableOpacity from "@/components/TouchableOpacity";

type PropTypes = {
  style?: ViewStyle | ViewStyle[];
  text: string;
  textColor?: string;
  isUpperCase?: boolean;
  onPress?: () => void;
};

const Button = ({
  style = {},
  text,
  textColor = undefined,
  isUpperCase = true,
  onPress = () => {},
}: PropTypes) => {
  const { t } = useTranslation();

  const backgroundColor = useThemeColor({}, "button");
  const buttonText = useThemeColor({}, "buttonText");

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
      <ThemedText type="bigButton" style={{ color: textColor || buttonText }}>
        {currentText}
      </ThemedText>
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
