import React, { memo } from "react";
import { Tabs } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { hasNotch } from "react-native-device-info";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Metrics from "@/constants/Metrics";

const Navigator = () => {
  const bottomBarColor = useThemeColor({}, "bottomBar");
  const bottomBarActiveIconsColor = useThemeColor({}, "bottomBarActiveIcons");
  const bottomBarInactiveIconsColor = useThemeColor(
    {},
    "bottomBarInactiveIcons"
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: bottomBarActiveIconsColor,
        tabBarInactiveTintColor: bottomBarInactiveIconsColor,
        headerShown: false,
        tabBarStyle: {
          height: hasNotch() ? 80 : 60,
          paddingTop: 10,
          backgroundColor: bottomBarColor,
          justifyContent: "center",
        },
      }}
      initialRouteName="(1_tab)"
    >
      <Tabs.Screen
        name="(1_tab)"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={Metrics.bottomBarIcon}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(2_tab)"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={Metrics.bottomBarIcon}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(3_tab)"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={Metrics.bottomBarIcon}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(4_tab)"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "user" : "user-o"}
              size={Metrics.bottomBarIcon}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default memo(Navigator);
