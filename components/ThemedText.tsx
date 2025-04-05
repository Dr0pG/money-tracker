import Durations from "@/constants/Durations";
import Metrics from "@/constants/Metrics";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { memo, useCallback } from "react";
import { type TextProps, StyleSheet } from "react-native";
import Animated, {
  BounceInDown,
  BounceOutDown,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  color?: string;
  animationType?: string;
  type?:
    | "default"
    | "error"
    | "medium"
    | "mediumBold"
    | "hightLight"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "bigButton"
    | "bigTitle"
    | "extremeTitle"
    | "gray"
    | "walletTotal";
};

const ThemedText = ({
  style,
  lightColor,
  darkColor,
  color,
  type = "default",
  animationType = undefined,
  ...rest
}: ThemedTextProps) => {
  const { theme } = useTheme();
  const lightText = lightColor || useThemeColor({}, "text");
  const darkText = darkColor || useThemeColor({}, "text");

  const textHighlight = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textHighlight"
  );
  const errorColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "error"
  );

  const buttonTextColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonText"
  );

  const grayColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textPlaceholder"
  );

  // Use derived value to compute the color based on `type` and `theme`
  const animatedTextColor = useDerivedValue(() => {
    if (color) {
      return withTiming(color, { duration: Durations.colorChanged });
    }
    switch (type) {
      case "bigButton":
        return withTiming(buttonTextColor, {
          duration: Durations.colorChanged,
        });
      case "error":
        return withTiming(errorColor, { duration: Durations.colorChanged });
      case "hightLight":
        return withTiming(textHighlight, { duration: Durations.colorChanged });
      case "gray":
        return withTiming(grayColor, {
          duration: Durations.colorChanged,
        });
      default:
        return withTiming(theme === "light" ? lightText : darkText, {
          duration: Durations.colorChanged,
        });
    }
  }, [
    color,
    theme,
    type,
    lightText,
    darkText,
    buttonTextColor,
    errorColor,
    textHighlight,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    color: animatedTextColor.value,
  }));

  const animation = useCallback(() => {
    if (!animationType) return null;
    switch (animationType) {
      case "fade":
        return {
          entering: FadeInDown.duration(Durations.animations).springify(),
          exiting: FadeOutDown.duration(Durations.animations).springify(),
        };
      case "bounce":
        return {
          entering: BounceInDown.duration(Durations.animations).springify(),
          exiting: BounceOutDown.duration(Durations.animations).springify(),
        };
      default:
        return null;
    }
  }, [animationType]);

  return (
    <Animated.Text
      {...rest}
      style={[
        type === "default" ? styles.default : undefined,
        type === "gray" ? styles.default : undefined,
        type === "medium" ? styles.medium : undefined,
        type === "mediumBold" ? styles.mediumBold : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "bigButton" ? styles.bigButton : undefined,
        type === "bigTitle" ? styles.bigTitle : undefined,
        type === "extremeTitle" ? styles.extremeTitle : undefined,
        type === "error" ? styles.error : undefined,
        type === "hightLight" ? styles.hightLight : undefined,
        type === "walletTotal" ? styles.walletTotal : undefined,
        animatedStyle,
        style,
      ]}
      {...(animation?.() &&
        !!animationType && {
          entering: animation().entering,
          exiting: animation().exiting,
        })}
    />
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: Metrics.size14,
    lineHeight: Metrics.size14 * 1.3,
  },
  error: {
    fontSize: Metrics.size12,
    lineHeight: Metrics.size12 * 1.3,
  },
  medium: {
    fontSize: Metrics.size16,
    lineHeight: Metrics.size16 * 1.3,
  },
  mediumBold: {
    fontSize: Metrics.size16,
    lineHeight: Metrics.size16 * 1.3,
    fontWeight: "bold",
  },
  defaultSemiBold: {
    fontSize: Metrics.size14,
    lineHeight: Metrics.size14 * 1.3,
    fontWeight: "600",
  },
  title: {
    fontSize: Metrics.size26,
    fontWeight: "bold",
    lineHeight: Metrics.size26,
  },
  bigTitle: {
    fontSize: Metrics.size30,
    fontWeight: "bold",
    lineHeight: Metrics.size30,
  },
  extremeTitle: {
    fontSize: Metrics.size30 * 1.2,
    fontWeight: "bold",
    lineHeight: Metrics.size30 * 1.2 * 1.3,
  },
  subtitle: {
    fontSize: Metrics.size18,
    lineHeight: Metrics.size18 * 1.3,
    fontWeight: "bold",
  },
  link: {
    fontSize: Metrics.size14,
    lineHeight: Metrics.size14 * 1.5,
  },
  bigButton: {
    fontSize: Metrics.textButton,
    lineHeight: Metrics.textButton * 1.5,
    fontWeight: "bold",
  },
  hightLight: {
    fontSize: Metrics.size14,
    lineHeight: Metrics.size14 * 1.3,
    fontWeight: "bold",
  },
  walletTotal: {
    fontSize: Metrics.size34 * 1.2,
    fontWeight: "600",
    lineHeight: Metrics.size34 * 1.2 * 1.3,
  },
});

export default memo(ThemedText);
