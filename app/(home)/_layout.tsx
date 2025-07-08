import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";
import React, { memo } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";

import Metrics from "@/constants/Metrics";

const Navigator = () => {
  const [
    bottomBarColor,
    bottomBarActiveIconsColor,
    bottomBarInactiveIconsColor,
  ] = useThemeColor({}, [
    "bottomBar",
    "bottomBarActiveIcons",
    "bottomBarInactiveIcons",
  ]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: bottomBarActiveIconsColor,
        tabBarInactiveTintColor: bottomBarInactiveIconsColor,
        headerShown: false,
        tabBarStyle: {
          height: Metrics.bottomBarHeight,
          paddingTop: Metrics.mediumPadding,
          backgroundColor: bottomBarColor,
          justifyContent: "center",
        },
      }}
      initialRouteName="(home)"
    >
      <Tabs.Screen
        name="(home)"
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
        name="(wallets)"
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
        name="(statistics)"
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
        name="(profile)"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
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
