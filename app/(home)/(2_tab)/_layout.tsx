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

const Wallets = () => {
  return (
    <JsStack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <JsStack.Screen
        name="createWallet"
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

export default memo(Wallets);
