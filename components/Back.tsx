import React from "react";
import TouchableOpacity from "@/components/TouchableOpacity";
import Ionicons from "@expo/vector-icons/Ionicons";
import Metrics from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";

type PropTypes = {
  onPress?: () => void;
};

const Back = ({ onPress = () => {} }: PropTypes) => {
  const iconColor = useThemeColor({}, "icon");
  const backButtonBackground = useThemeColor({}, "backButtonBackground");

  return (
    <TouchableOpacity
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

export default Back;
