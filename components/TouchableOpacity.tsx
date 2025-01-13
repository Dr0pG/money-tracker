import {
  TouchableOpacity as RNTouchableOpacity,
  ViewStyle,
} from "react-native";
import React from "react";
import { TouchableOpacity as GestureTouchableOpacity } from "react-native-gesture-handler";

type PropTypes = {
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
  onPress?: () => void;
  useGestureHandler?: boolean;
  disabled?: boolean;
};

const TouchableOpacity = ({
  style = {},
  children,
  onPress = () => {},
  useGestureHandler = false,
  disabled = false,
}: PropTypes) => {
  const Component = useGestureHandler
    ? GestureTouchableOpacity
    : RNTouchableOpacity;

  return (
    <Component
      activeOpacity={0.5}
      style={style}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </Component>
  );
};

export default TouchableOpacity;
