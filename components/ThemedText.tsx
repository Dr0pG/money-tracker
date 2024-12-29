import React, { useEffect, useCallback } from "react";
import { type TextProps, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  BounceInDown,
  BounceOutDown,
  FadeInDown,
  FadeOutDown,
  useDerivedValue,
} from "react-native-reanimated";
import Metrics from "@/constants/Metrics";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import Durations from "@/constants/Durations";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  animationType?: string;
  type?:
    | "default"
    | "error"
    | "medium"
    | "hightLight"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "bigButton"
    | "bigTitle"
    | "extremeTitle";
};

const ThemedText = ({
  style,
  lightColor,
  darkColor,
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

  const animatedColor = useSharedValue(
    theme === "light" ? lightText : darkText
  );

  // Use derived value to compute the color based on `type` and `theme`
  const animatedTextColor = useDerivedValue(() => {
    switch (type) {
      case "bigButton":
        return withTiming(buttonTextColor, {
          duration: Durations.colorChanged,
        });
      case "error":
        return withTiming(errorColor, { duration: Durations.colorChanged });
      case "hightLight":
        return withTiming(textHighlight, { duration: Durations.colorChanged });
      default:
        return withTiming(theme === "light" ? lightText : darkText, {
          duration: Durations.colorChanged,
        });
    }
  }, [
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
      style={[
        animatedStyle,
        type === "default" ? styles.default : undefined,
        type === "medium" ? styles.medium : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "bigButton" ? styles.bigButton : undefined,
        type === "bigTitle" ? styles.bigTitle : undefined,
        type === "extremeTitle" ? styles.extremeTitle : undefined,
        type === "error" ? styles.error : undefined,
        type === "hightLight" ? styles.hightLight : undefined,
        style,
      ]}
      {...rest}
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
    fontSize: Metrics.defaultText,
    lineHeight: Metrics.defaultText * 1.3,
  },
  error: {
    fontSize: Metrics.smallText,
    lineHeight: Metrics.smallText * 1.3,
  },
  medium: {
    fontSize: Metrics.mediumText,
    lineHeight: Metrics.mediumText * 1.3,
  },
  defaultSemiBold: {
    fontSize: Metrics.defaultText,
    lineHeight: Metrics.defaultText * 1.3,
    fontWeight: "600",
  },
  title: {
    fontSize: Metrics.bigTitleText,
    fontWeight: "bold",
    lineHeight: Metrics.bigTitleText,
  },
  bigTitle: {
    fontSize: Metrics.veryBigTitleText,
    fontWeight: "bold",
    lineHeight: Metrics.veryBigTitleText,
  },
  extremeTitle: {
    fontSize: Metrics.veryBigTitleText * 1.2,
    fontWeight: "bold",
    lineHeight: Metrics.veryBigTitleText * 1.2 * 1.3,
  },
  subtitle: {
    fontSize: Metrics.subtitleText,
    fontWeight: "bold",
  },
  link: {
    fontSize: Metrics.defaultText,
    lineHeight: Metrics.defaultText * 1.5,
  },
  bigButton: {
    fontSize: Metrics.textButton,
    lineHeight: Metrics.textButton * 1.5,
    fontWeight: "bold",
  },
  hightLight: {
    fontSize: Metrics.defaultText,
    lineHeight: Metrics.defaultText * 1.3,
    fontWeight: "bold",
  },
});

export default ThemedText;
