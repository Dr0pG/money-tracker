import {
  TouchableOpacity as RNTouchableOpacity,
  ViewStyle,
} from "react-native";
import React, { memo } from "react";
import { Pressable as GesturePressable } from "react-native-gesture-handler";

type PropTypes = {
  testID?: string;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
  onPress?: () => void;
  useGestureHandler?: boolean;
  disabled?: boolean;
};

const TouchableOpacity = ({
  testID = "button",
  style = {},
  children,
  onPress = () => {},
  useGestureHandler = false,
  disabled = false,
}: PropTypes) => {
  const Component = useGestureHandler ? GesturePressable : RNTouchableOpacity;

  return (
    <Component
      testID={testID}
      activeOpacity={0.5}
      style={style}
      onPress={onPress}
      disabled={disabled}
      accessible
      accessibilityRole="button"
    >
      {children}
    </Component>
  );
};

export default memo(TouchableOpacity);
