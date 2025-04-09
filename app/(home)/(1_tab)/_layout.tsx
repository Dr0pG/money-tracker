import React, { memo } from "react";

import { Stack, withLayoutContext } from "expo-router";
import {
  createStackNavigator,
  StackNavigationEventMap,
  StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";
import { ParamListBase, StackNavigationState } from "@react-navigation/native";

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);

const Home = () => {
  return (
    <JsStack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <JsStack.Screen
        name="searchTransaction"
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
          presentation: "modal",
          gestureEnabled: true,
        }}
      />
    </JsStack>
  );
};

export default memo(Home);
