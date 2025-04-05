import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TouchableOpacity from "./TouchableOpacity";
import Metrics from "@/constants/Metrics";
import ThemedText from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";

const TAB_COUNT = 3;
const TAB_WIDTH = (Metrics.screenWidth - Metrics.largePadding * 2) / TAB_COUNT;

type PropTypes = {
  data: string[];
  onChangeTab: (index: number) => void;
  children: React.ReactNode;
};

const Tabs = ({ data, onChangeTab, children }: PropTypes) => {
  const { t } = useTranslation();

  const background = useThemeColor({}, "orange");

  const [selectedIndex, setSelectedIndex] = useState(0);
  const animatedIndex = useSharedValue(0);

  useEffect(() => {
    onChangeTab?.(selectedIndex);
  }, [selectedIndex]);

  const changeTab = (index: number) => {
    setSelectedIndex(index);
    animatedIndex.value = withTiming(index, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedIndex.value * TAB_WIDTH }],
    backgroundColor: background,
  }));

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <Animated.View style={[styles.movingBg, animatedStyle]} />

          {data.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={styles.tabButton}
              onPress={() => changeTab(index)}
            >
              <ThemedText type="mediumBold">{t(item)}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Metrics.largePadding,
  },
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: Metrics.tabHeight,
    borderRadius: Metrics.tabHeight / 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
    position: "relative",
  },
  movingBg: {
    position: "absolute",
    width: TAB_WIDTH,
    height: "100%",
    borderRadius: Metrics.tabHeight / 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Tabs;
