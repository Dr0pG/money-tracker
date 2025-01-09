import React, { memo } from "react";
import { Stack } from "expo-router";

const Login = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sign_up" options={{ headerShown: false }} />
      <Stack.Screen name="sign_in" options={{ headerShown: false }} />
    </Stack>
  );
};

export default memo(Login);
