import React from "react";
import { type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import Metrics from "@/constants/Metrics";
import { useCallback } from "react";
import Animated, {
  BounceInDown,
  BounceOutDown,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";

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
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const textHighlight = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textHighlight"
  );
  const error = useThemeColor({ light: lightColor, dark: darkColor }, "error");

  const animation = useCallback(() => {
    if (!animationType) return null;
    switch (animationType) {
      case "fade":
        return {
          entering: FadeInDown.duration(1000).springify(),
          exiting: FadeOutDown.duration(1000).springify(),
        };
      case "bounce":
        return {
          entering: BounceInDown.duration(1000).springify(),
          exiting: BounceOutDown.duration(1000).springify(),
        };
      default:
        return null;
    }
  }, [animationType]);

  return (
    <Animated.Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "medium" ? styles.medium : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "bigButton" ? styles.bigButton : undefined,
        type === "bigTitle" ? styles.bigTitle : undefined,
        type === "extremeTitle" ? styles.extremeTitle : undefined,
        type === "error" ? [styles.error, { color: error }] : undefined,
        type === "hightLight"
          ? [styles.hightLight, { color: textHighlight }]
          : undefined,
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
    fontSize: Metrics.veryBigTitleText * 1.5,
    fontWeight: "bold",
    lineHeight: Metrics.veryBigTitleText * 1.5 * 1.3,
  },
  subtitle: {
    fontSize: Metrics.subtitleText,
    fontWeight: "bold",
  },
  link: {
    fontSize: Metrics.defaultText,
    lineHeight: Metrics.defaultText * 1.5,
    color: "#0a7ea4",
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
