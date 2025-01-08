import React, { memo } from "react";
import { Tabs } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Metrics from "@/constants/Metrics";

const Home = () => {
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
          height: 80,
          paddingTop: 10,
          backgroundColor: bottomBarColor,
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused}) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={Metrics.bottomBarIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
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
        name="accounts"
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
        name="profile"
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

export default memo(Home);
