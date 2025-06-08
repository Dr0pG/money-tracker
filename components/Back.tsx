import TouchableOpacity from "@/components/TouchableOpacity";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo } from "react";
import { StyleSheet } from "react-native";

type PropTypes = {
  onPress?: () => void;
};

const Back = ({ onPress = () => {} }: PropTypes) => {
  const [iconColor, backButtonBackground] = useThemeColor({}, [
    "icon",
    "backButtonBackground",
  ]);

  return (
    <TouchableOpacity
      testID="back-button"
      style={[styles.container, { backgroundColor: backButtonBackground }]}
      onPress={onPress}
    >
      <Ionicons name="chevron-back" size={Metrics.backIcon} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Metrics.backButtonSize,
    height: Metrics.backButtonSize,
    borderRadius: Metrics.mediumRadius,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(Back);
