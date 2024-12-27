import { type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import Animated, {
  BounceInDown,
  BounceOutDown,
  Easing,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import { memo, useCallback } from "react";

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
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const animation = useCallback(() => {
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
        return {
          entering: BounceInDown.duration(1000).springify(),
          exiting: BounceOutDown.duration(1000).springify(),
        };
    }
  }, [animationType]);

  return (
    <Animated.View
      style={[{ backgroundColor }, style]}
      entering={animation().entering}
      exiting={animation().exiting}
      {...otherProps}
    />
  );
};

export default memo(AnimatedThemedView);
