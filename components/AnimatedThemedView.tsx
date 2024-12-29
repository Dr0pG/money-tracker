import { type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import Animated, {
  BounceInDown,
  BounceOutDown,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { memo, useCallback, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import Durations from "@/constants/Durations";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  animationType?: "fade" | "bounce";
};

const AnimatedThemedView = ({
  style,
  lightColor,
  darkColor,
  animationType,
  ...otherProps
}: ThemedViewProps) => {
  const { theme } = useTheme();

  const lightBg = lightColor || useThemeColor({}, "background");
  const darkBg = darkColor || useThemeColor({}, "background");

  // Shared value to hold the current background color
  const animatedColor = useSharedValue(theme === "light" ? lightBg : darkBg);

  useEffect(() => {
    animatedColor.value = withTiming(theme === "light" ? lightBg : darkBg, {
      duration: Durations.colorChanged, // Adjust duration for smoother transitions
    });
  }, [theme, lightBg, darkBg]);

  // Animated style for background color
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedColor.value,
  }));

  const animation = useCallback(() => {
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
        return {
          entering: BounceInDown.duration(Durations.animations).springify(),
          exiting: BounceOutDown.duration(Durations.animations).springify(),
        };
    }
  }, [animationType]);

  return (
    <Animated.View
      style={[animatedStyle, style]}
      entering={animation().entering}
      exiting={animation().exiting}
      {...otherProps}
    />
  );
};

export default memo(AnimatedThemedView);
