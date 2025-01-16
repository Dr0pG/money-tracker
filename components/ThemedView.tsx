import React, { memo, useEffect } from "react";
import { type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import Durations from "@/constants/Durations";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const ThemedView = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) => {
  const { theme } = useTheme();
  const lightBg = lightColor || useThemeColor({}, "background");
  const darkBg = darkColor || useThemeColor({}, "background");

  const animatedColor = useSharedValue(theme === "light" ? lightBg : darkBg);

  useEffect(() => {
    animatedColor.value = withTiming(theme === "light" ? lightBg : darkBg, {
      duration: Durations.colorChanged,
    });
  }, [theme, lightBg, darkBg]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedColor.value,
  }));

  return <Animated.View style={[animatedStyle, style]} {...otherProps} />;
};

export default memo(ThemedView);
