import React, { memo } from "react";

import { ParamListBase, StackNavigationState } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationEventMap,
  StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";
import { Stack, withLayoutContext } from "expo-router";

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);

const Profile = () => {
  return (
    <JsStack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <JsStack.Screen
        name="editProfile"
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
          presentation: "modal",
          gestureEnabled: true,
        }}
      />
      <JsStack.Screen
        name="settings"
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
          presentation: "modal",
          gestureEnabled: true,
        }}
      />
      <JsStack.Screen
        name="privacyPolicy"
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

export default memo(Profile);
